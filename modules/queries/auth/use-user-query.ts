import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/app/actions/auth-actions'
import { useAuthStore } from '@/modules/stores'
import { unwrapActionResult } from '@/shared/lib/types/action-result'
import { useEffect } from 'react'

export function useUserQuery() {
  const { setUser, setLoading } = useAuthStore()

  const query = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const result = await getCurrentUser()
      return unwrapActionResult(result)
    },
    staleTime: 1000 * 60 * 5, // 5분
    retry: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (query.data !== undefined) {
      setUser(query.data)
      setLoading(false)
    }
  }, [query.data, setUser, setLoading])

  useEffect(() => {
    if (query.isError) {
      setUser(null)
      setLoading(false)
    }
  }, [query.isError, setUser, setLoading])

  return query
}
