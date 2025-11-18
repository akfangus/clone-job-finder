import type { JSX } from 'react'

import { cn } from '@/shared/lib/utils'

type SpinnerSize = 'sm' | 'md' | 'lg'

const sizeClassNameMap: Record<SpinnerSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export interface SpinnerProps {
  text?: string
  size?: SpinnerSize
  className?: string
}

export function Spinner(props: SpinnerProps) {
  const { text, size = 'md', className } = props

  const spinnerClassName = sizeClassNameMap[size]

  return (
    <div className={cn('inline-flex items-center gap-2 text-sm text-gray-500', className)}>
      <span
        aria-hidden
        className={cn(
          'inline-block animate-spin rounded-full border-2 border-gray-300 border-t-gray-700',
          spinnerClassName
        )}
      />
      {text ? <span>{text}</span> : null}
    </div>
  )
}
