'use client'

import type { ReactElement } from 'react'
import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import get from 'lodash/get'
import dayjs from 'dayjs'

interface TodoResponse {
  id: number
  title: string
  completed: boolean
}

const HOME_TODO_QUERY_KEY = ['home', 'todo'] as const

function useHomeTodo() {
  return useQuery({
    queryKey: HOME_TODO_QUERY_KEY,
    queryFn: fetchHomeTodo,
    staleTime: 1000 * 60,
  })
}

async function fetchHomeTodo(): Promise<TodoResponse> {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('할 일 정보를 불러오는데 실패했습니다.')
  }

  return response.json() as Promise<TodoResponse>
}

export function HomeQuerySection(): ReactElement {
  const { data, isLoading, isError, error, refetch, dataUpdatedAt, isRefetching } = useHomeTodo()
  const handleRefetch = useCallback(() => {
    void refetch({ throwOnError: false })
  }, [refetch])

  if (isLoading) {
    return (
      <section className="w-full max-w-[480px] rounded-[16px] border border-gray-200 bg-white p-[24px] shadow-sm">
        <p className="text-gray-600 text-regular-16">할 일 정보를 가져오는 중입니다...</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="w-full max-w-[480px] rounded-[16px] border border-red-200 bg-red-50 p-[24px] shadow-sm">
        <p className="text-red-600 text-regular-16">{get(error, 'message', '알 수 없는 오류가 발생했습니다.')}</p>
        <button
          type="button"
          onClick={handleRefetch}
          className="mt-[16px] inline-flex h-[40px] items-center justify-center rounded-[12px] bg-red-500 px-[16px] text-regular-14 text-white hover:bg-red-600"
        >
          다시 시도
        </button>
      </section>
    )
  }

  const title = get(data, 'title', '제목이 없습니다.')
  const completed = get(data, 'completed', false)
  const fetchedAt = dayjs(dataUpdatedAt).format('YYYY-MM-DD HH:mm:ss')

  return (
    <section className="w-full max-w-[480px] rounded-[16px] border border-gray-200 bg-white p-[24px] shadow-sm">
      <p className="text-gray-500 text-regular-14">예시 API에서 받아온 데이터</p>
      <h2 className="mt-[8px] text-regular-20 text-gray-900">{title}</h2>
      <dl className="mt-[16px] space-y-[8px]">
        <div className="flex justify-between items-center">
          <dt className="text-gray-500 text-regular-14">완료 여부</dt>
          <dd className="text-gray-900 text-regular-16">{completed ? '완료' : '미완료'}</dd>
        </div>
        <div className="flex justify-between items-center">
          <dt className="text-gray-500 text-regular-14">업데이트 시각</dt>
          <dd className="text-gray-900 text-regular-16">{fetchedAt}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={handleRefetch}
        className="mt-[24px] inline-flex h-[44px] w-full items-center justify-center rounded-[12px] bg-gray-900 text-regular-16 text-white hover:bg-gray-700"
      >
        {isRefetching ? '새로고침 중...' : '데이터 새로고침'}
      </button>
    </section>
  )
}
