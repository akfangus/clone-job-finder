'use client'

import { PropsWithChildren, useEffect, useMemo, useState } from 'react'

import { useResponsiveBreakpoint } from '@/modules/hooks/use-responsive-breakpoint'
import { cn } from '@/shared/lib/utils'

export interface ResponsiveContainerProps extends PropsWithChildren {
  className?: string
  desktopClassName?: string
  mobileClassName?: string
}

export function ResponsiveContainer({
  children,
  className,
  desktopClassName,
  mobileClassName,
}: ResponsiveContainerProps) {
  const { mode, isPending } = useResponsiveBreakpoint()
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    if (isPending) {
      return undefined
    }

    const frameId = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(frameId)
  }, [isPending])

  const responsiveClassName = useMemo(() => {
    if (mode === 'desktop') {
      return cn('', desktopClassName)
    }

    return cn('', mobileClassName)
  }, [desktopClassName, mobileClassName, mode])

  return (
    <div
      data-mode={mode}
      data-ready={isVisible}
      className={cn('flex flex-col mx-auto w-full max-w-[1080px] min-w-[360px]', responsiveClassName, className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 160ms ease-out',
      }}
    >
      {children}
    </div>
  )
}
