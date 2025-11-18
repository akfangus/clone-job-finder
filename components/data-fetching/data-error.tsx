import type { JSX } from 'react'

export interface DataErrorProps {
  message?: string
}

export function DataError(props: DataErrorProps): JSX.Element {
  const { message = '데이터를 불러오는 중 오류가 발생했습니다.' } = props

  return <div className="flex items-center justify-center py-10 text-sm text-red-500">{message}</div>
}
