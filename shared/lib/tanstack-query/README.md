# React Query 구성 안내

## 개요
`shared/lib/tanstack-query` 디렉터리는 App Router 환경에서 React Query를 안정적으로 사용할 수 있도록 준비된 설정 모듈입니다. Server Component와 Client Component 사이에서 캐시를 공유하고, 에러 핸들러를 주입할 수 있도록 한 단계 래핑된 Provider를 제공합니다.

## 구성 요소
- `query-client.ts`
  - `createQueryClient()`: 기본 옵션이 적용된 `QueryClient` 인스턴스를 생성합니다.
  - `queryClient`: 간단한 util 용도로 사용할 수 있는 기본 인스턴스입니다.
  - `setQueryErrorHandler(handler)`: 외부에서 정의한 에러 핸들러를 등록합니다.
- `react-query-provider.tsx`
  - `ReactQueryProvider`: Client Component에서만 렌더되며, 내부에서 `QueryClientProvider`와 Devtools를 관리합니다.

## 기본 옵션
- `retry: false`: 명시적 제어 전까지 요청을 자동 재시도하지 않습니다.
- `refetchOnWindowFocus: false`: 페이지 포커싱 시 자동 갱신을 막아 예측 가능한 UX를 제공합니다.
- `staleTime: 5분`: 5분 동안 데이터를 신선한 상태로 유지합니다.
- `mutations.onError`: 등록된 에러 핸들러를 호출해 전역 로깅이나 토스트 알림을 연결할 수 있습니다.

## 사용 방법
1. 루트 레이아웃에서 `ReactQueryProvider`로 자식 트리를 감쌉니다.
   ```tsx
   // app/layout.tsx
   import { ReactQueryProvider } from '../shared/lib/tanstack-query'

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="ko">
         <body>
           <ReactQueryProvider>{children}</ReactQueryProvider>
         </body>
       </html>
     )
   }
   ```
2. Client Component에서 `useQuery`, `useMutation`을 자유롭게 사용합니다.
   ```tsx
   // components/home/home-query-section.tsx
   const { data, isLoading } = useQuery({ queryKey: ['key'], queryFn: fetcher })
   ```

## 서버 컴포넌트와의 연동
- Server Component는 React Query 훅을 직접 사용하지 못하지만, `ReactQueryProvider`가 Server Component에서 감싸지도록 구성되어 있으므로 하위 Client Component에서 동일한 캐시를 활용할 수 있습니다.
- 추후 `HydrationBoundary`와 `dehydrate`를 사용하면 서버 측에서 미리 데이터를 패칭해 전달하는 패턴으로 확장할 수 있습니다.

## 에러 핸들링
- `ReactQueryProvider`에 `onError` 콜백을 전달하면 모든 Mutation 에러가 해당 콜백으로 위임됩니다.
  ```tsx
  <ReactQueryProvider onError={(error) => logError(error)}>
    {children}
  </ReactQueryProvider>
  ```
- Provider 언마운트 시 자동으로 핸들러를 해제해 메모리 누수나 중복 호출을 방지합니다.

## Devtools
- 개발 환경(`process.env.NODE_ENV === 'development'`)에서만 `ReactQueryDevtools`를 자동 렌더링합니다.
- 기본 위치는 `bottom-right`이며, 필요 시 컴포넌트 내부에서 속성을 조정할 수 있습니다.

## 확장 아이디어
- `defaultQueryClientOptions`를 수정해 전역 옵션을 변경하거나 캐시 시간을 세분화할 수 있습니다.
- 프로젝트 전용 에러 로깅 훅, 토스트 알림, Sentry 연동 등을 `setQueryErrorHandler`를 통해 연결할 수 있습니다.
- `prefetchQuery`와 `dehydrate`를 사용하면 SSR 중 미리 데이터를 확보해 초기 로딩 속도를 높일 수 있습니다.

## 참고 체크리스트
- [ ] 새 Client Component를 만들 때 `'use client'` 지시자를 추가했는가?
- [ ] `useQuery`의 `queryKey`가 직렬화 가능한 값으로 구성되어 있는가?
- [ ] 에러 메시지를 사용자 친화적으로 재가공했는가?
- [ ] Devtools를 비활성화해야 하는 배포 환경에서 `NODE_ENV`가 정확하게 설정되어 있는가?

