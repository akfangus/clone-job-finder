'use client'

import type { ReactElement, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createQueryClient, setQueryErrorHandler } from './query-client'

interface ReactQueryProviderProps {
  children: ReactNode
  onError?: (error: unknown) => void
}

export function ReactQueryProvider({ children, onError }: ReactQueryProviderProps): ReactElement {
  const [queryClient] = useState(() => createQueryClient())
  const devtoolsEnabled = useMemo(() => process.env.NODE_ENV === 'development', [])

  useEffect(() => {
    setQueryErrorHandler(onError ?? null)
    return () => setQueryErrorHandler(null)
  }, [onError])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {devtoolsEnabled ? <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> : null}
    </QueryClientProvider>
  )
}
