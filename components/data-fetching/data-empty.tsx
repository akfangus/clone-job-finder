import type { JSX } from 'react'

export interface DataEmptyProps {
  message?: string
}

export function DataEmpty(props: DataEmptyProps): JSX.Element {
  const { message = '표시할 데이터가 없습니다.' } = props

  return <div className="flex items-center justify-center py-10 text-sm text-gray-500">{message}</div>
}
