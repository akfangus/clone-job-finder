import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signIn } from '@/app/actions/auth-actions'
import { useAuthStore } from '@/modules/stores'
import { unwrapActionResult } from '@/shared/lib/types/action-result'

interface SignInRequest {
  email: string
  password: string
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: async ({ email, password }: SignInRequest) => {
      const result = await signIn(email, password)
      return unwrapActionResult(result)
    },
    onSuccess: (data) => {
      // Zustand 스토어에 사용자 정보 저장
      login(data.user)
      // 사용자 쿼리 무효화하여 최신 정보 가져오기
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    },
    onError: (error: Error) => {
      console.error('Login error:', error)
      // 에러는 unwrapActionResult에서 throw되므로 여기서 처리
    },
  })
}
