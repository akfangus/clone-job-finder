# Next.js 서버 사이드 아키텍처

## 현재 구조 (Server Actions 기반)

```
┌─────────────────────────────────────────────────────────┐
│              브라우저 (클라이언트)                        │
│  React Component                                        │
│    ↓                                                    │
│  React Query Mutation                                   │
│    ↓                                                    │
│  Server Action (app/actions/auth-actions.ts)            │
│    ↓                                                    │
│  Supabase Server Client                                   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Supabase (백엔드)                            │
│  - auth.users 테이블                                     │
│  - 인증 처리                                             │
│  - JWT 토큰 발급                                         │
└─────────────────────────────────────────────────────────┘
```

## Server Actions란?

Server Actions는 Next.js의 서버 사이드 함수입니다. `'use server'` 디렉티브를 사용하여 서버에서만 실행되는 함수를 만들 수 있습니다.

### 주요 특징

- **타입 안정성**: TypeScript로 전체 플로우 타입 체크
- **간단한 호출**: 직접 함수 호출 (fetch 불필요)
- **자동 직렬화**: Next.js가 데이터 자동 변환
- **서버 사이드 검증**: 서버에서 모든 검증 수행
- **에러 처리 일관성**: 통일된 에러 처리 패턴

## 구현 예시

### 1. Server Action 생성

```typescript
// app/actions/auth-actions.ts
'use server'

import { createServerClient } from '@/shared/lib/supabase/server'
import type { ActionResultUnion } from '@/shared/lib/types/action-result'

export async function signIn(
  email: string,
  password: string
): Promise<ActionResultUnion<AuthResponse>> {
  try {
    // 서버 사이드 검증
    if (!email || !password) {
      return {
        success: false,
        error: '이메일과 비밀번호를 입력해주세요.',
      }
    }

    // 서버 사이드 Supabase 클라이언트 사용
    const supabase = createServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.',
    }
  }
}
```

### 2. React Query Mutation에서 사용

```typescript
// modules/queries/auth/use-login-mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signIn } from '@/app/actions/auth-actions'
import { unwrapActionResult } from '@/shared/lib/types/action-result'

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const result = await signIn(email, password)
      return unwrapActionResult(result)
    },
    onSuccess: (data) => {
      login(data.user)
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    },
    onError: (error: Error) => {
      console.error('Login error:', error)
    },
  })
}
```

### 3. 컴포넌트에서 사용

```typescript
// components/login-modal/login-form.tsx
'use client'

import { useLoginMutation } from '@/modules/queries/auth'

export function LoginForm() {
  const loginMutation = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginMutation.mutateAsync({ email, password })
    } catch (error) {
      // 에러 처리
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## 에러 처리 패턴

### ActionResult 타입

```typescript
// shared/lib/types/action-result.ts
export interface ActionResult<T> {
  success: true
  data: T
}

export interface ActionError {
  success: false
  error: string
}

export type ActionResultUnion<T> = ActionResult<T> | ActionError

export function unwrapActionResult<T>(result: ActionResultUnion<T>): T {
  if (!result.success) {
    throw new Error(result.error)
  }
  return result.data
}
```

### 사용 방법

```typescript
// Server Action에서
return { success: true, data: user }
return { success: false, error: '에러 메시지' }

// React Query Mutation에서
const result = await signIn(email, password)
const data = unwrapActionResult(result) // 성공 시 데이터, 실패 시 Error throw
```

## 파일 구조

```
app/
  actions/
    auth-actions.ts          # Server Actions 정의

modules/
  queries/
    auth/
      use-login-mutation.ts  # React Query Mutation
      use-signup-mutation.ts
      use-logout-mutation.ts
      use-user-query.ts

shared/
  lib/
    types/
      action-result.ts       # ActionResult 타입 정의
    supabase/
      server.ts              # 서버 사이드 Supabase 클라이언트
      client.ts              # 클라이언트 사이드 Supabase 클라이언트
```

## 장점

1. **타입 안정성**: TypeScript로 전체 플로우 타입 체크
2. **간단한 호출**: 직접 함수 호출 (fetch 없음)
3. **자동 직렬화**: Next.js가 데이터 자동 변환
4. **서버 사이드 검증**: 서버에서 모든 검증 수행
5. **에러 처리 일관성**: 통일된 에러 처리 패턴

## 주의사항

- Server Actions는 서버 사이드에서만 실행됨
- `'use server'` 디렉티브를 파일 상단에 추가해야 함
- 클라이언트 컴포넌트에서 직접 호출 가능
- React Query와 함께 사용하면 캐싱 및 상태 관리 가능
