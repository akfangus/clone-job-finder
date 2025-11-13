import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signUp } from '@/app/actions/auth-actions'
import { useAuthStore } from '@/modules/stores'
import { unwrapActionResult } from '@/shared/lib/types/action-result'

interface SignUpRequest {
  email: string
  password: string
}

export function useSignupMutation() {
  const queryClient = useQueryClient()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: async ({ email, password }: SignUpRequest) => {
      const result = await signUp(email, password)
      return unwrapActionResult(result)
    },
    onSuccess: (data) => {
      // 회원가입 후 자동 로그인
      login(data.user)
      // 사용자 쿼리 무효화하여 최신 정보 가져오기
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    },
    onError: (error: Error) => {
      console.error('Signup error:', error)
      // 에러는 unwrapActionResult에서 throw되므로 여기서 처리
    },
  })
}
