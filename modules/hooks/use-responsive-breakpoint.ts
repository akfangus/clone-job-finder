import { useEffect, useMemo, useState } from 'react'

import {
  RESPONSIVE_BOUNDARY,
  RESPONSIVE_MEDIA_QUERIES,
  ResponsiveMode,
  getResponsiveMode,
} from '@/shared/lib/responsive'

export type ResponsiveClientMode = ResponsiveMode | 'pending'

export interface UseResponsiveBreakpointResult {
  mode: ResponsiveClientMode
  isDesktop: boolean
  isMobile: boolean
  isPending: boolean
  boundary: number
}

export function useResponsiveBreakpoint(): UseResponsiveBreakpointResult {
  const [mode, setMode] = useState<ResponsiveClientMode>('pending')

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia(RESPONSIVE_MEDIA_QUERIES.desktop)

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      const matches = 'matches' in event ? event.matches : mediaQuery.matches
      setMode(matches ? 'desktop' : 'mobile')
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      handleChange(mediaQuery)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    handleChange(mediaQuery)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  return useMemo<UseResponsiveBreakpointResult>(() => {
    const isDesktop = mode === 'desktop'
    const isMobile = mode === 'mobile'
    return {
      mode,
      isDesktop,
      isMobile,
      isPending: mode === 'pending',
      boundary: RESPONSIVE_BOUNDARY,
    }
  }, [mode])
}
