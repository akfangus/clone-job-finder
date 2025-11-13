import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthService } from '@/shared/api'
import { useAuthStore } from '@/modules/stores'

interface SignInRequest {
  email: string
  password: string
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: ({ email, password }: SignInRequest) => AuthService.signIn(email, password),
    onSuccess: (data) => {
      // Zustand 스토어에 사용자 정보 저장
      login(data.user)
      // 사용자 쿼리 무효화하여 최신 정보 가져오기
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    },
    onError: (error: Error) => {
      console.error('Login error:', error)
    },
  })
}
