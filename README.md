## Clone Soomgo – 구인구직 플랫폼 초기 세팅

이 저장소는 프리랜서-고객 매칭을 목표로 하는 **구인구직 플랫폼**의 초석을 다지기 위한 환경 구성 프로젝트입니다. 서비스 본 기능은 아직 구축되지 않았지만, 디자인 시스템과 인프라를 미리 정리해 향후 포트폴리오 확장 속도를 높이는 데 집중했습니다.

---

## 기술 스택 개요

- **Framework**: Next.js 15 (App Router) + React 19
- **인증**: Supabase + Server Actions
- **상태 관리**: Zustand, React Query
- **스타일링**: Tailwind CSS, shadcn/ui 기반 유틸리티, Radix UI
- **아이콘 & 유틸리티**: lucide-react, class-variance-authority, lodash (단일 함수 import 전략)
- **이미지 & 폰트**: WebP 우선 전략, Pretendard Variable
- **테스팅/문서화**: Storybook 10, Chromatic 준비
- **언어/도구**: TypeScript, ESLint/Prettier, Turbopack dev 서버

---

## 최근 작업 요약

### 2025-01-17
- **Server Actions 기반 인증 시스템 마이그레이션**
  - Server Actions 생성: `app/actions/auth-actions.ts` (signUp, signIn, signOut, getCurrentUser)
  - ActionResult 타입 시스템: `shared/lib/types/action-result.ts` (타입 안전한 에러 처리)
  - React Query Mutations 업데이트: 모든 인증 관련 mutations을 Server Actions로 전환
  - API Routes 제거: `app/api/auth/` 디렉토리 제거 (Server Actions로 대체)
  - AuthService deprecated 처리: 하위 호환을 위해 유지하되 사용 중단 안내 추가
- **문서 업데이트**
  - `docs/nextjs-architecture.md`: Server Actions 기반 아키텍처로 완전히 재작성
  - `docs/api-architecture-example.md`: Server Actions 구현 예제로 재작성
  - 이전 버전의 API Routes 관련 내용 제거
- **주요 개선사항**
  - 타입 안정성 강화: TypeScript로 전체 플로우 타입 체크
  - 에러 처리 일관성: 통일된 ActionResult 패턴으로 에러 처리
  - 서버 사이드 검증: 모든 검증 로직을 서버에서 처리
  - 코드 간소화: fetch 없이 직접 함수 호출로 간단해짐
  - 자동 직렬화: Next.js가 데이터 자동 변환

### 2025-11-12
- 그룹바이 홈페이지 메인 UI 구현: 메인 페이지의 6개 섹션 컴포넌트를 구현했습니다.
  - `MainIntro`: 히어로 섹션 (그라데이션 배경, 페이드인 애니메이션, CTA 버튼)
  - `Investor`: 투자자 로고 무한 스크롤 애니메이션 (CSS keyframes 기반)
  - `BannerIntro`: 3초마다 자동 전환되는 배너 (useEffect + setInterval)
  - `ProjectPlan`: 4가지 서비스 플랜 카드 스와이프 (클릭/터치 인터랙션, 인디케이터)
  - `JoinStartup`: 스타트업 로고 그리드 레이아웃 (반응형, 호버 효과)
  - `BottomFloatButton`: 스크롤 감지 플로팅 버튼 (화면 높이 기준, throttle 최적화)
- Next.js 이미지 설정: `next.config.ts`에 `via.placeholder.com` 호스트를 추가하여 외부 이미지 로딩을 지원합니다.
- 성능 최적화: React.memo, throttle, CSS transform을 활용하여 렌더링 성능을 최적화했습니다.

### 2025-11-11
- 반응형 내비게이션 시스템 구축: `components/navigation` 전반을 정리해 데스크톱/모바일 헤더를 분리하고, `SubMenuBar`와 `useNavInteraction` 훅을 통해 호버/클릭 기반 상호작용을 지원합니다.
- 사용성 개선 훅 정리: `useNavInteraction`과 `useResponsiveBreakpoint` 훅에서 명시적 상태 분리와 메모이제이션으로 재랜더를 최소화했습니다.
- 레이아웃 안정화: `ResponsiveContainer` 컴포넌트로 가시성 제어(requestAnimationFrame 기반)와 뷰포트 폭 제한을 통합해 초기 레이아웃 시프트를 줄였습니다.

---

## 환경 구성 & 스크립트

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# Storybook 문서
npm run storybook

# 생산 빌드
npm run build

# Lint 검사 (자동 수정)
npm run lint
npm run lint:fix

# Storybook 정적 빌드
npm run build-storybook
```

개발 서버는 `http://localhost:3000`, Storybook은 `http://localhost:6006`에서 확인할 수 있습니다.

---

## 프로젝트 구조 하이라이트

```
app/                # Next.js 페이지, 전역 레이아웃 및 스타일
 ├─ actions/        # Server Actions
 │  └─ auth-actions.ts  # 인증 관련 Server Actions
 ├─ layout.tsx      # 루트 레이아웃
 └─ page.tsx        # 홈 페이지

components/         # UI 컴포넌트
 ├─ ui/            # shadcn 스타일 가이드에 맞춘 UI 컴포넌트
 │  ├─ badge.tsx
 │  ├─ button.tsx
 │  ├─ dialog.tsx
 │  ├─ input.tsx
 │  ├─ portal.tsx
 │  ├─ tag.tsx
 │  └─ tooltip.tsx
 ├─ login-modal/   # 로그인/회원가입 모달
 │  ├─ login-form.tsx
 │  ├─ signup-form.tsx
 │  └─ login-modal.tsx
 └─ navigation/    # 내비게이션 컴포넌트

modules/           # 비즈니스 로직 모듈
 ├─ queries/       # React Query hooks
 │  └─ auth/       # 인증 관련 queries/mutations
 │     ├─ use-login-mutation.ts
 │     ├─ use-signup-mutation.ts
 │     ├─ use-logout-mutation.ts
 │     └─ use-user-query.ts
 ├─ stores/        # Zustand stores
 │  └─ auth-store.ts
 └─ components/    # 공통 컴포넌트
    └─ auth-session-restorer.tsx

shared/            # 공유 유틸리티 및 서비스
 ├─ api/           # API 서비스 (deprecated - Server Actions 사용 권장)
 ├─ lib/           # 라이브러리 유틸리티
 │  ├─ supabase/   # Supabase 클라이언트
 │  │  ├─ client.ts    # 클라이언트 사이드
 │  │  └─ server.ts    # 서버 사이드
 │  ├─ types/      # 타입 정의
 │  │  └─ action-result.ts  # Server Actions 결과 타입
 │  └─ utils/      # 유틸리티 함수
 │     └─ email-validation.ts
 └─ lib/http-client/  # HTTP 클라이언트 (Axios 기반)

features/home/     # 홈 페이지 기능 모듈
 ├─ main.tsx       # 홈 메인 컴포넌트
 └─ components/    # 홈 페이지 섹션 컴포넌트
    ├─ main-intro.tsx
    ├─ investor.tsx
    ├─ banner-intro.tsx
    ├─ project-plan.tsx
    ├─ join-startup.tsx
    └─ bottom-float-button.tsx

theme/             # 텍스트 스타일 등 토큰 정의
docs/              # 문서
 ├─ nextjs-architecture.md      # Next.js 아키텍처 가이드
 ├─ api-architecture-example.md # Server Actions 예제
 └─ supabase-email-setup.md     # Supabase 이메일 설정 가이드
```

---

## 구축된 UI 컴포넌트

- `Button`, `Badge`, `Tag`  
  - `class-variance-authority`로 variant/size 제어  
  - Storybook playground 제공, 아이콘 및 로딩 변형 포함

- `Portal`  
  - `Dialog` 래퍼를 이용한 전체폭 모달  
  - 최대 너비 1060px, 좌우 16px 여백 유지  
  - header/content/footer를 ReactNode로 주입 가능

- `Tooltip`  
  - Radix Tooltip 기반  
  - 방향(side), 지연, 항상 열림(open) 시나리오를 Storybook에서 직접 제어

모든 Storybook 문서는 인터랙티브 컨트롤을 제공하여 디자인 리뷰 및 회귀 테스트를 지원합니다.

---

## 개발 가이드

- 함수형 컴포넌트 + 명시적 TypeScript 인터페이스 사용
- 로직은 가급적 훅으로 분리하고 컴포넌트에서는 단순 표현에 집중
- Tailwind 유틸리티는 선언형으로 작성하며, 중복보다 반복과 모듈화를 선호
- 이미지 자산은 WebP 포맷, `TCImage`/`TCImageBox`로 최적화 처리 예정
- lodash는 개별 함수 import (`import keys from 'lodash/keys'`) 규칙 준수
- dayjs를 날짜/시간 처리 도구로 채택 (향후 API 연동 시 활용 예정)

---

## 인증 시스템

### Server Actions 기반 인증

프로젝트는 Next.js Server Actions를 사용하여 인증 시스템을 구현했습니다.

- **Server Actions**: `app/actions/auth-actions.ts`
  - `signUp(email, password)`: 회원가입
  - `signIn(email, password)`: 로그인
  - `signOut()`: 로그아웃
  - `getCurrentUser()`: 현재 사용자 정보 가져오기

- **React Query 통합**: `modules/queries/auth/`
  - `useLoginMutation`: 로그인 mutation
  - `useSignupMutation`: 회원가입 mutation
  - `useLogoutMutation`: 로그아웃 mutation
  - `useUserQuery`: 사용자 정보 query

- **상태 관리**: Zustand (`modules/stores/auth-store.ts`)
  - 사용자 정보 전역 상태 관리
  - 인증 상태 관리

### 환경 변수 설정

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # 선택사항
```

자세한 내용은 `docs/nextjs-architecture.md`와 `docs/api-architecture-example.md`를 참고하세요.

---

## 향후 로드맵 아이디어

- 구직자/고객 매칭을 위한 도메인 모델 정의 및 Server Actions 기반 API 연동
- 검색·필터 UI, 즐겨찾기 등 주요 인터랙션 컴포넌트 확장
- Storybook 기반 비주얼 회귀, Vitest + Playwright를 이용한 E2E 테스트 도입
- 접근성(A11y) 점검 및 다크모드/국제화(i18n) 지원

---

## 기여 & 피드백

프로젝트는 포트폴리오용으로 지속적인 개선이 예정되어 있습니다. 의견이나 개선 아이디어가 있다면 이슈/PR 또는 메일로 알려주세요. 즐거운 개발 되세요! 🚀
