'use client'

import { cn } from '@/shared/lib/utils'
import { PropsWithChildren } from 'react'

export interface HeaderProps extends PropsWithChildren {
  className?: string
}

export function Header({ children, className }: HeaderProps) {
  return (
    <header className={cn('flex sticky top-0 justify-between items-center px-2 z-5', className)}>{children}</header>
  )
}
