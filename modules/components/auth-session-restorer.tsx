'use client'

import { useEffect } from 'react'
import { useUserQuery } from '@/modules/queries/auth'
import { useAuthStore } from '@/modules/stores'
import { useLogoutMutation } from '@/modules/queries/auth'

export function AuthSessionRestorer() {
  const { data: user, isLoading } = useUserQuery()
  const { clearAuth } = useAuthStore()
  const logoutMutation = useLogoutMutation()

  useEffect(() => {
    // 세션 복원 완료 후 로깅 (개발 환경)
    if (process.env.NODE_ENV === 'development') {
      if (!isLoading) {
        if (user) {
          console.log('Session restored:', user.email)
        } else {
          console.log('No active session')
        }
      }
    }
  }, [user, isLoading])

  useEffect(() => {
    // 401 에러 발생 시 로그아웃 처리
    const handleUnauthorized = async () => {
      try {
        clearAuth()
        await logoutMutation.mutateAsync()
      } catch (error) {
        console.error('Logout error:', error)
        clearAuth()
      }
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [clearAuth, logoutMutation])

  // 이 컴포넌트는 렌더링하지 않음
  return null
}
