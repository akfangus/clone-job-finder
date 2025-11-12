'use client'

import { cn } from '@/shared/lib/utils'
import { PropsWithChildren } from 'react'

export interface HeaderProps extends PropsWithChildren {
  className?: string
}

export function Header({ children, className }: HeaderProps) {
  return (
    <header className={cn('flex sticky top-0 z-50 justify-between items-center px-2 bg-white', className)}>
      {children}
    </header>
  )
}
