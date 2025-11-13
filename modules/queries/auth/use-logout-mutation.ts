import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthService } from '@/shared/api'
import { useAuthStore } from '@/modules/stores'

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()

  return useMutation({
    mutationFn: () => AuthService.signOut(),
    onSuccess: () => {
      // Zustand 스토어 초기화
      logout()
      // 모든 쿼리 캐시 제거
      queryClient.clear()
    },
    onError: (error: Error) => {
      console.error('Logout error:', error)
      // 에러가 발생해도 로컬 상태는 초기화
      logout()
      queryClient.clear()
    },
  })
}

