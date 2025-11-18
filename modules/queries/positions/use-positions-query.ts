import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { PositionsResponse, UsePositionsQueryParams, JobItem } from './types'

const POSITIONS_QUERY_KEY = ['positions'] as const

function createPositionsQueryKey(params: UsePositionsQueryParams): readonly unknown[] {
  return [...POSITIONS_QUERY_KEY, params]
}

async function fetchPositions(params: UsePositionsQueryParams): Promise<PositionsResponse> {
  const url = new URL('/api/positions', window.location.origin)

  if (params.category) {
    url.searchParams.set('category', params.category)
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error('채용 정보를 불러오는데 실패했습니다.')
  }

  const data = (await response.json()) as PositionsResponse

  return {
    jobs: data.jobs ?? [],
  }
}

export function usePositionsQuery(params: UsePositionsQueryParams): UseQueryResult<JobItem[]> {
  const queryKey = createPositionsQueryKey(params)

  return useQuery({
    queryKey,
    queryFn: async () => {
      const data = await fetchPositions(params)
      return data.jobs
    },
  })
}


