import type { JSX } from 'react'

import { Spinner } from '@/components/ui/spinner'

export interface DataLoadingProps {
  text?: string
}

export function DataLoading(props: DataLoadingProps): JSX.Element {
  const { text = '로딩 중입니다...' } = props

  return (
    <div className="flex items-center justify-center py-10">
      <Spinner text={text} />
    </div>
  )
}
