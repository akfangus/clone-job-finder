# Server Actions 활용 예제

## 구조

### Server Actions 기반 구조

```typescript
// 클라이언트 → Server Action → Supabase
const result = await signIn(email, password)
const data = unwrapActionResult(result)
```

## 구현 예제

### 1. Server Action 생성

```typescript
// app/actions/auth-actions.ts
'use server'

import { createServerClient } from '@/shared/lib/supabase/server'
import type { ActionResultUnion } from '@/shared/lib/types/action-result'

export async function signUp(
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

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return {
        success: false,
        error: '비밀번호는 최소 6자 이상이어야 합니다.',
      }
    }

    // 서버 사이드 Supabase 클라이언트 사용
    const supabase = createServerClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    if (!data.user || !data.session) {
      return {
        success: false,
        error: '회원가입에 실패했습니다.',
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
      error: error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.',
    }
  }
}
```

### 2. React Query Mutation에서 사용

```typescript
// modules/queries/auth/use-signup-mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signUp } from '@/app/actions/auth-actions'
import { unwrapActionResult } from '@/shared/lib/types/action-result'

export function useSignupMutation() {
  const queryClient = useQueryClient()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const result = await signUp(email, password)
      return unwrapActionResult(result)
    },
    onSuccess: (data) => {
      login(data.user)
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    },
    onError: (error: Error) => {
      console.error('Signup error:', error)
    },
  })
}
```

### 3. 컴포넌트에서 사용

```typescript
// components/login-modal/signup-form.tsx
'use client'

import { useSignupMutation } from '@/modules/queries/auth'

export function SignupForm() {
  const signupMutation = useSignupMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signupMutation.mutateAsync({ email, password })
      // 성공 처리
    } catch (error) {
      // 에러 처리 (unwrapActionResult에서 throw된 에러)
      setError(error instanceof Error ? error.message : '회원가입에 실패했습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드 */}
    </form>
  )
}
```

## 에러 처리

### ActionResult 타입 사용

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

### 사용 예시

```typescript
// Server Action에서
const result = await signUp(email, password)

// 성공 시
if (result.success) {
  console.log(result.data)
}

// 실패 시
if (!result.success) {
  console.error(result.error)
}

// 또는 unwrapActionResult 사용
try {
  const data = unwrapActionResult(result)
  console.log(data)
} catch (error) {
  console.error(error.message)
}
```

## Server Actions 목록

### 인증 관련

- `signUp(email, password)`: 회원가입
- `signIn(email, password)`: 로그인
- `signOut()`: 로그아웃
- `getCurrentUser()`: 현재 사용자 정보 가져오기

### 파일 위치

- `app/actions/auth-actions.ts`: 모든 인증 관련 Server Actions

## 환경 변수 설정

### 클라이언트 사이드

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 서버 사이드

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... # 선택사항 (Admin 기능용)
```

## 장점

1. **타입 안정성**: TypeScript로 전체 플로우 타입 체크
2. **간단한 호출**: 직접 함수 호출 (fetch 불필요)
3. **자동 직렬화**: Next.js가 데이터 자동 변환
4. **서버 사이드 검증**: 서버에서 모든 검증 수행
5. **에러 처리 일관성**: 통일된 에러 처리 패턴
