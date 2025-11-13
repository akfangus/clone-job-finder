import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthService } from '@/shared/api'
import { useAuthStore } from '@/modules/stores'

interface SignUpRequest {
  email: string
  password: string
}

export function useSignupMutation() {
  const queryClient = useQueryClient()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: ({ email, password }: SignUpRequest) => AuthService.signUp(email, password),
    onSuccess: (data) => {
      // 회원가입 후 자동 로그인
      login(data.user)
      // 사용자 쿼리 무효화하여 최신 정보 가져오기
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    },
    onError: (error: Error) => {
      console.error('Signup error:', error)
    },
  })
}

