### 트러블슈팅: 네비게이션/새로고침 시 로그인 탭 깜빡임

---

### 1. 증상

- 로그인 후 **새로고침 / 페이지 이동** 시:
  - 잠깐 **비로그인 탭(로그인 버튼)** 이 보였다가
  - 곧바로 **로그인된 탭**으로 바뀌는 깜빡임 발생.

---

### 2. 원인

- **서버/클라이언트 Supabase 세션 불일치**
  - `createServerClient`가 단순 `createClient` 기반이라  
    서버 액션에서 `getCurrentUser` 호출 시 **항상 익명 클라이언트**처럼 동작했다.
  - React Query `useUserQuery`가 `null`을 받아와서  
    `useAuthStore.setUser(null)` → Zustand 상태가 비로그인으로 다시 덮어써짐.

- **초기 렌더 시 Zustand 초기값 문제**
  - 클라이언트 첫 렌더에서 `useAuthStore`는 항상  
    `user: null`, `isAuthenticated: false` 로 시작했다.
  - 서버에서 로그인 여부를 모르는 상태로 먼저 **비로그인 UI를 렌더**한 뒤,  
    나중에 `AuthSessionRestorer`가 로그인 상태를 반영 → 깜빡임 구조.

---

### 3. 해결 방법 (핵심)

- **Supabase SSR + 쿠키 기반으로 정렬**
  - `shared/lib/supabase/server.ts`
    - `@supabase/ssr`의 `createServerClient` + `cookies()` 사용.
    - `export async function createServerClient()` 로 변경.
  - `shared/lib/supabase/client.ts`
    - `createBrowserClient` 사용해서 브라우저와 SSR 세션 동기화.

- **서버에서 유저 먼저 읽고, Zustand 초기 상태로 주입**
  - `modules/stores/auth-store.tsx`
    - `AuthStoreProvider` + `useAuthStore` 구조 도입 (상태는 전부 Zustand, Context는 얇은 래퍼).
  - `app/layout.tsx`
    - `const supabase = await createServerClient()`
    - `const { data: { user } } = await supabase.auth.getUser()`
    - 이 값을 `AuthStoreProvider initialUser / initialIsAuthenticated`로 전달.
  - `components/navigation/navigation.tsx`
    - `isLoading` 기반 스켈레톤 제거 → **SSR에서 내려준 상태만 사용**해서 헤더 렌더.

- **토큰 쿠키 저장 (부가적인 개선)**
  - `app/actions/auth-actions.ts`
    - `signIn` / `signUp` 성공 시:
      - `access_token`, `refresh_token`을 HttpOnly 쿠키에 저장.
    - `signOut` 시 쿠키 삭제.

---

### 4. 결과

- 새로고침 / 페이지 이동 시:
  - **처음부터 서버에서 계산된 로그인 상태로 헤더/네비가 렌더**된다.
  - “비로그인 탭이 잠깐 보였다가 로그인 탭으로 바뀌는” 깜빡임 제거.
- 로그인/로그아웃/401 처리 플로우는 기존 구조를 유지하면서  
  **UX만 안정적으로 개선**된 상태.


