# 작업 로그

## 2025-01-17

### Server Actions 기반 인증 시스템 마이그레이션

#### 구현 내용
1. **Server Actions 생성** (`app/actions/auth-actions.ts`)
   - `signUp`: 회원가입 Server Action
   - `signIn`: 로그인 Server Action
   - `signOut`: 로그아웃 Server Action
   - `getCurrentUser`: 현재 사용자 정보 가져오기 Server Action
   - 서버 사이드 검증 및 에러 처리 구현
   - Supabase 에러 코드를 사용자 친화적인 메시지로 변환

2. **ActionResult 타입 시스템** (`shared/lib/types/action-result.ts`)
   - `ActionResult<T>`: 성공 결과 타입
   - `ActionError`: 실패 결과 타입
   - `ActionResultUnion<T>`: 성공/실패 유니온 타입
   - `unwrapActionResult`: 결과를 확인하고 데이터를 반환하는 헬퍼 함수

3. **React Query Mutations 업데이트**
   - `useLoginMutation`: Server Action `signIn` 호출
   - `useSignupMutation`: Server Action `signUp` 호출
   - `useLogoutMutation`: Server Action `signOut` 호출
   - `useUserQuery`: Server Action `getCurrentUser` 호출
   - 모든 mutations에서 `unwrapActionResult`를 사용하여 에러 처리

4. **기존 코드 정리**
   - API Routes 제거: `app/api/auth/signup/route.ts`, `app/api/auth/signin/route.ts`
   - API Routes 디렉토리 제거: `app/api/auth/`
   - `AuthService` deprecated 처리: 하위 호환을 위해 유지하되 사용 중단 안내 추가

5. **문서 업데이트**
   - `docs/nextjs-architecture.md`: Server Actions 기반 아키텍처로 완전히 재작성
   - `docs/api-architecture-example.md`: Server Actions 구현 예제로 재작성
   - 이전 버전의 API Routes 관련 내용 제거

#### 주요 개선사항
- **타입 안정성**: TypeScript로 전체 플로우 타입 체크
- **에러 처리 일관성**: 통일된 ActionResult 패턴으로 에러 처리
- **서버 사이드 검증**: 모든 검증 로직을 서버에서 처리
- **코드 간소화**: fetch 없이 직접 함수 호출로 간단해짐
- **자동 직렬화**: Next.js가 데이터 자동 변환

#### 기술적 특징
- Server Actions의 `'use server'` 디렉티브 사용
- 서버 사이드 Supabase 클라이언트 사용 (`shared/lib/supabase/server.ts`)
- React Query와 Server Actions 통합
- Zustand를 통한 전역 상태 관리
- 타입 안전한 에러 처리 패턴

#### 파일 구조 변경
```
app/
  actions/
    auth-actions.ts          # Server Actions 정의 (신규)

modules/
  queries/
    auth/
      use-login-mutation.ts  # Server Action 호출로 업데이트
      use-signup-mutation.ts # Server Action 호출로 업데이트
      use-logout-mutation.ts # Server Action 호출로 업데이트
      use-user-query.ts      # Server Action 호출로 업데이트

shared/
  lib/
    types/
      action-result.ts       # ActionResult 타입 정의 (신규)
    supabase/
      server.ts              # 서버 사이드 Supabase 클라이언트

app/api/auth/                # 제거됨
```

## 2025-11-12

### 그룹바이 홈페이지 메인 UI 구현

#### 구현된 컴포넌트
1. **MainIntro** (`features/home/components/main-intro.tsx`)
   - 히어로 섹션 구현
   - 그라데이션 배경 (blue-50 → purple-50 → pink-50)
   - 페이드인 애니메이션 (tw-animate-css 활용)
   - 큰 제목, 부제목, CTA 버튼 포함
   - 반응형 텍스트 크기 (모바일/데스크톱)

2. **Investor** (`features/home/components/investor.tsx`)
   - 투자자 로고 무한 스크롤 애니메이션
   - CSS `@keyframes`를 사용한 끊김 없는 루프 구현
   - 로고를 3배 복제하여 자연스러운 무한 스크롤
   - 호버 시 애니메이션 일시정지
   - 양쪽 끝 그라데이션 페이드 효과

3. **BannerIntro** (`features/home/components/banner-intro.tsx`)
   - 3초마다 문구 자동 전환 배너
   - `useEffect`와 `setInterval`을 사용한 타이머 구현
   - 페이드 인/아웃 전환 애니메이션 (300ms)
   - 4가지 메시지 순환 표시

4. **ProjectPlan** (`features/home/components/project-plan.tsx`)
   - 4가지 서비스 플랜 카드 스와이프
   - 클릭/터치로 좌우 스와이프 가능
   - 터치 제스처 지원 (minSwipeDistance: 50px)
   - 인디케이터(점)로 현재 위치 표시
   - 이전/다음 버튼 네비게이션
   - CSS transform을 사용한 슬라이드 애니메이션 (500ms)

5. **JoinStartup** (`features/home/components/join-startup.tsx`)
   - 스타트업 로고 그리드 레이아웃
   - 반응형 그리드 (모바일: 2열, 태블릿: 3열, 데스크톱: 4열)
   - 호버 시 로고 확대 및 그림자 효과
   - 그라데이션 오버레이 효과
   - CTA 섹션 포함

6. **BottomFloatButton** (`features/home/components/bottom-float-button.tsx`)
   - 스크롤 감지 플로팅 버튼
   - 화면 높이만큼 스크롤 시 나타남
   - 최하단 100px 전에 사라지는 로직
   - `lodash/throttle`을 사용한 성능 최적화 (100ms)
   - 부드러운 페이드 인/아웃 애니메이션
   - 클릭 시 맨 위로 부드럽게 스크롤

#### 통합 및 설정
- `features/home/main.tsx`: 모든 섹션 컴포넌트 통합
- `features/home/components/index.tsx`: 모든 컴포넌트 export 추가
- `next.config.ts`: `via.placeholder.com` 이미지 호스트 설정 추가

#### 성능 최적화
- 모든 컴포넌트에 `React.memo` 적용
- 스크롤 이벤트에 `throttle` 적용 (100ms)
- CSS `transform`과 `opacity`만 사용하여 GPU 가속 활용
- 이미지 `loading="lazy"` 속성 적용

#### 기술적 특징
- TypeScript 인터페이스로 타입 안정성 확보
- 접근성: `aria-label` 속성 추가
- 시맨틱 HTML 태그 사용 (`section`, `main` 등)
- 반응형 디자인: 모바일/데스크톱 대응
- Tailwind CSS 유틸리티 클래스 활용
- 프로젝트 텍스트 스타일 시스템 활용 (`font-regular-*`, `font-heading-*`)

## 2025-11-11

- 내비게이션 메뉴: `useNavInteraction` 훅으로 호버/클릭 모드를 구분하고 SubMenuBar 렌더를 지연해 불필요한 페인트를 줄였습니다.
- 레이아웃 기반 다듬기: `ResponsiveContainer`에서 requestAnimationFrame 기반 가시성 제어와 Tailwind 레이아웃 토큰을 통합했습니다.
- 문서 정비: `README.md`에 최신 작업 요약을 추가해 온보딩 가이드를 갱신했습니다.
