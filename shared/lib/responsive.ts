export interface ResponsiveBreakpointConfig {
  desktop: number
  mobile: number
}

export const RESPONSIVE_BOUNDARY = 1080

export const RESPONSIVE_BREAKPOINTS: ResponsiveBreakpointConfig = {
  desktop: RESPONSIVE_BOUNDARY,
  mobile: 0,
}

export interface ResponsiveQueryConfig {
  desktop: string
  mobile: string
}

export const RESPONSIVE_MEDIA_QUERIES: ResponsiveQueryConfig = {
  desktop: `(min-width: ${RESPONSIVE_BREAKPOINTS.desktop}px)`,
  mobile: `(max-width: ${RESPONSIVE_BOUNDARY - 1}px)`,
}

export type ResponsiveMode = keyof ResponsiveBreakpointConfig

export function getResponsiveMode(width: number): ResponsiveMode {
  const isDesktop = width >= RESPONSIVE_BOUNDARY
  return isDesktop ? 'desktop' : 'mobile'
}
