## /positions 채용 공고 기능 구현 정리

이 문서는 `/positions` 경로에서 **직무 카테고리별 채용 공고 리스트**를 보여주기 위해 구현한 전체 흐름(DB → API → React Query → UI)을 정리한 것입니다.  
이 과정에서 Supabase MCP, Next.js API Route, React Query, TailwindCSS, lodash를 활용했습니다.

---

## 1. DB 스키마 설계 (Supabase)

### 1-1. companies 테이블

- **역할**: 회사(기업) 기본 정보를 저장하는 테이블
- 주요 컬럼:
  - `id uuid primary key default gen_random_uuid()`
  - `name text not null`
  - `logo_url text`
  - `homepage_url text`
  - `created_at timestamptz not null default now()`
- 인덱스:
  - `companies_name_unique` (unique index on `name`)  
    → 목데이터 seed 시 같은 이름으로 upsert 가능.

### 1-2. jobs 테이블

- **역할**: 실제 채용 공고 데이터를 저장하는 테이블
- 주요 컬럼:
  - `id uuid primary key default gen_random_uuid()`
  - `company_id uuid not null references companies(id) on delete cascade`
  - `title text not null`
  - `category text not null` (예: `개발`, `디자인`, `마케팅`)
  - `employment_type text` (예: `정규직`, `계약직`, `인턴`)
  - `location text not null`
  - `description text not null`
  - `salary_range text`
  - `tags text[]`
  - `is_active boolean not null default true`
  - `created_at timestamptz not null default now()`
- 인덱스:
  - `jobs_company_id_idx` (company_id)
  - `jobs_category_idx` (category)
  - `jobs_is_active_created_at_idx` (is_active, created_at desc)
  - `jobs_company_id_title_unique` (company_id, title unique)  
    → 같은 회사 내 동일 제목 공고 중복 방지.

### 1-3. 장단점

- **장점**
  - 스키마가 단순해서 빠르게 기능을 붙일 수 있고, 나중에 `tags`, `locations` 등으로 확장 가능.
  - 인덱스를 미리 잡아서 카테고리/최신순 조회 시 성능 손해를 줄임.
- **단점 / 트레이드오프**
  - `category`, `employment_type`를 enum 테이블로 분리하지 않아 데이터 정합성이 100% 강제되지는 않음.
  - 태그를 `text[]`로 관리해서 복잡한 태그 검색에는 추가 설계가 필요.

---

## 2. Supabase MCP를 이용한 migration & seed

### 2-1. migration 적용

- MCP 함수 `mcp_supabase_apply_migration`을 사용해 위 스키마를 생성하는 SQL을 실행했습니다.
- 특징:
  - `create table if not exists` / `create index if not exists`로 **여러 번 실행해도 안전**하게 동작.

### 2-2. 목데이터 seed

- MCP 함수 `mcp_supabase_execute_sql`을 사용해 샘플 회사/채용 공고를 insert 했습니다.
- 로직:
  - `companies`는 `on conflict (name) do update`로 idempotent upsert.
  - `jobs`는 `(company_id, title)`에 대해 `on conflict do update`로 중복 없이 upsert.
- 샘플 데이터 구성:
  - 회사: `혜움`, `토스`, `당근마켓`
  - 직무 카테고리: `개발`, `디자인`, `마케팅`을 골고루 분배
  - tags에 기술 스택/역할 키워드를 기록

### 2-3. 장단점

- **장점**
  - migration + seed가 코드 레벨에서 관리되어, 새 환경에서도 쉽게 재현 가능.
  - 반복 실행해도 깨지지 않는 idempotent 설계.
- **단점**
  - seed가 SQL로만 관리되기 때문에, 복잡해지면 별도 seed 관리 도구 / 스크립트가 필요할 수 있음.

---

## 3. 서버 레이어: job-service

### 3-1. `shared/api/job-service.ts`

- **역할**: Supabase에서 채용 데이터(+회사 정보)를 읽어오는 서버 전용 유틸.
- 주요 타입:

```ts
export interface Job {
  id: string
  companyId: string
  companyName: string
  companyLogoUrl: string | null
  title: string
  category: string
  employmentType: string | null
  location: string
  description: string
  salaryRange: string | null
  tags: string[]
  createdAt: string
}
```

- 주요 로직:
  - `createServerAdminClient()`를 사용해 서버용 Supabase Admin 클라이언트 생성.
  - `jobs` 테이블을 기준으로 `companies`를 조인하여 한 번에 필요한 필드만 select.
  - `is_active = true`, `created_at desc`로 정렬.
  - 옵션:
    - `category` 필터 (where)
    - `limit`, `offset`으로 페이지네이션 준비.

### 3-2. 장단점

- **장점**
  - 서버에서 DB 액세스를 캡슐화해서 API Route, Server Actions 등에서 재사용 가능.
  - 필요한 필드만 명시적으로 select → 네트워크, 메모리 사용 최소화.
- **단점**
  - Admin 클라이언트를 사용하므로 **반드시 서버 전용**으로만 사용해야 하며, 권한 관리에 주의 필요.

---

## 4. Next.js API Route: `/api/positions`

### 4-1. 구현 개요

- 위치: `app/api/positions/route.ts`
- `GET` 메서드에서 `fetchJobs`를 호출해 `{ jobs }` 형태의 JSON을 반환.
- 쿼리 파라미터:
  - `category` (optional)
  - `limit`, `offset` (optional, 추후 페이지네이션에 사용 가능)

```ts
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category') ?? undefined
  const limitParam = searchParams.get('limit')
  const offsetParam = searchParams.get('offset')

  const limit = limitParam ? Number(limitParam) : undefined
  const offset = offsetParam ? Number(offsetParam) : undefined

  const { jobs } = await fetchJobs({ category, limit, offset })

  return NextResponse.json({ jobs }, { status: 200 })
}
```

### 4-2. 에러 처리

- `fetchJobs` 과정에서 Error가 발생하면:
  - 에러 메시지를 포함한 JSON과 함께 `500` status 반환.
  - 클라이언트에서는 React Query의 `isError`를 통해 사용자 친화적인 메시지 표시.

### 4-3. 장단점

- **장점**
  - 클라이언트는 Supabase를 몰라도 `/api/positions`만 호출하면 됨 → 의존성 분리.
  - 향후 인증/권한 체크, 로깅 등을 API 레이어에서 쉽게 추가 가능.
- **단점**
  - 클라이언트 ↔ 서버 ↔ Supabase로 hop이 한 번 더 생기므로, 아주 단순한 프로젝트라면 직접 Supabase를 호출하는 것보다 한 단계 더 복잡.

---

## 5. React Query 훅 & 그룹핑 훅

### 5-1. 타입 정의: `modules/queries/positions/types.ts`

- `JobItem`, `PositionsResponse`, `UsePositionsQueryParams`, `JobGroupByCategory` 인터페이스 정의.
- API, 훅, UI가 모두 이 타입을 공유해 타입 안정성을 유지.

### 5-2. `usePositionsQuery`

- 위치: `modules/queries/positions/use-positions-query.ts`
- 역할:
  - 브라우저에서 `/api/positions`를 호출.
  - React Query의 `useQuery`로 로딩/에러/캐싱 상태를 관리.
- 특징:
  - `queryKey`에 파라미터(`category`)를 포함해 캐시를 분리.
  - 응답이 비어 있더라도 항상 `jobs: []` 형태로 정규화.

### 5-3. `useGroupedPositionsByCategory`

- 위치: `modules/queries/positions/use-grouped-positions-by-category.ts`
- 역할:
  - `JobItem[]`을 받아 **직무 카테고리별 그룹 구조**로 변환.
  - `lodash`의 `groupBy`와 `useMemo`를 사용해 성능 최적화.

```ts
export function useGroupedPositionsByCategory(jobs: JobItem[] | undefined): JobGroupByCategory[] {
  const safeJobs = jobs ?? []

  return useMemo(() => {
    const grouped = groupBy(safeJobs, (job) => job.category)

    return Object.entries(grouped).map(([category, categoryJobs]) => ({
      category,
      jobs: categoryJobs,
    }))
  }, [safeJobs])
}
```

### 5-4. 장단점

- **장점**
  - 컴포넌트는 `jobs` 또는 `grouped` 데이터만 받아서 렌더링 → UI와 비즈니스 로직 분리.
  - `groupBy` + `useMemo`로 불필요한 재계산을 줄여 성능 상 이점.
- **단점**
  - 그룹핑을 클라이언트에서 하기 때문에, 아주 큰 데이터셋에서는 서버 그룹핑/페이지네이션이 필요할 수 있음.

---

## 6. UI 구조: `/positions` 페이지

### 6-1. 엔트리 페이지

- 위치: `app/positions/page.tsx`
- 역할: feature 레벨 컴포넌트인 `PositionsMain`만 렌더링.

```tsx
import { PositionsMain } from '@/features/positions'

export default function PositionsPage() {
  return <PositionsMain />
}
```

### 6-2. 컨테이너: `PositionsMain`

- 위치: `features/positions/main.tsx`
- 역할:
  - 페이지 레이아웃(main, padding, max-width 등) 담당.
  - 헤더(제목/설명)와 실제 콘텐츠(`PositionsPageContent`)를 감싸는 최소한의 컨테이너.

### 6-3. 클라이언트 로직: `PositionsPageContent`

- 위치: `features/positions/positions-page-content.tsx`
- 상단에 `"use client"`를 선언해 클라이언트 컴포넌트로 동작.
- 역할:
  - 카테고리 상태 관리 (`전체`, `개발`, `디자인`, `마케팅`).
  - `usePositionsQuery`로 데이터 fetch.
  - `useGroupedPositionsByCategory`로 카테고리별 그룹 데이터 생성.
  - 로딩/에러/공백 상태 처리.
  - 프레젠테이셔널 컴포넌트(`CategoryTabs`, `CategorySection`) 호출.

### 6-4. 프레젠테이셔널 컴포넌트

- `CategoryTabs`
  - 카테고리 필터 버튼 UI.
  - Tailwind로 pill 형태의 탭을 구현.
  - 비즈니스 로직 없음, 선택 변경 콜백만 수행.
- `CategorySection`
  - 특정 카테고리의 채용 카드 리스트를 렌더링.
  - 회사명, 포지션명, 위치, 고용 형태, 태그만 표시하는 단순 UI.

### 6-5. 장단점

- **장점**
  - 컨테이너(`PositionsPageContent`)에만 로직을 두고, 나머지 컴포넌트는 단순 표현에 집중 → 응집도와 가독성 향상.
  - TailwindCSS만 사용해서 스타일이 단일 시스템으로 관리.
- **단점**
  - 카테고리 정의(`JOB_CATEGORIES`)가 컴포넌트 내부에 있어, 카테고리 종류를 늘릴 때 해당 상수를 직접 수정해야 함(추후 상수 모듈로 추출 가능).

---

## 7. 확장 포인트 & 개선 아이디어

1. **카테고리/필터 확장**
   - DB에 `employment_type`, `location` 인덱스를 추가하고,
   - API 쿼리 파라미터에 `employmentType`, `location`을 추가하여 복합 필터 구현 가능.
2. **페이지네이션 / 무한 스크롤**
   - API에서 `limit`, `offset`을 적극적으로 활용하거나, React Query의 `useInfiniteQuery`로 전환해 무한 스크롤 구현.
3. **정렬 옵션**
   - 최신순/인기순(조회수, 지원자 수 등) 정렬 로직을 추가할 수 있음.
4. **날짜 표현 개선**
   - `createdAt`을 `dayjs`로 포맷하여 "3일 전", "2025-01-17" 형태 등으로 사용자 친화적인 표시 가능.

---

## 8. 이 구조의 전체적인 장단점 요약

- **장점**
  - DB → 서비스 → API → React Query → UI 계층이 명확히 분리되어 유지보수/확장성이 좋음.
  - Supabase MCP로 스키마와 seed를 코드/도구 레벨에서 관리해 재현성이 높음.
  - Lodash `groupBy` + `useMemo`, React Query 캐시 등으로 기본적인 성능 최적화를 적용.
  - 컴포넌트는 최소한의 로직, 훅은 최대한의 로직을 가지도록 분리하여 가독성과 응집도를 높임.
- **단점 / 고려 사항**
  - 현재는 비교적 단순한 스키마/API 구조로, 매우 복잡한 필터링/통계 요구사항이 생기면 추가적인 서버/쿼리 튜닝이 필요.
  - 카테고리/태그 등의 값이 하드코딩된 부분은 향후 별도 설정/상수 모듈 또는 DB 기반 마스터 데이터로 분리하는 것이 바람직함.


