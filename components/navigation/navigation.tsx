'use client'

import { useResponsiveBreakpoint } from '@/modules/hooks/use-responsive-breakpoint'
import { DesktopHeader, MobileHeader } from './header'

export function Navigation() {
  const { mode } = useResponsiveBreakpoint()

  if (mode === 'pending') {
    return <></>
  }

  return (
    <div className="flex justify-between items-center w-full h-[64px] px-2 ">
      {mode === 'desktop' && <DesktopHeader />}
      {mode === 'mobile' && <MobileHeader />}
    </div>
  )
}
