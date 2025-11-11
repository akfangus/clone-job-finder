import { QueryClient } from '@tanstack/react-query'

type ErrorHandler = (error: unknown) => void

let externalErrorHandler: ErrorHandler | null = null

const defaultQueryClientOptions = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },

    mutations: {
      onError: (error: unknown) => {
        externalErrorHandler?.(error)
      },
    },
  },
} as const

export const setQueryErrorHandler = (handler: ErrorHandler | null) => {
  externalErrorHandler = handler
}

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    ...defaultQueryClientOptions,
    defaultOptions: {
      ...defaultQueryClientOptions.defaultOptions,
      mutations: {
        ...defaultQueryClientOptions.defaultOptions.mutations,
        onError: (error: unknown) => {
          externalErrorHandler?.(error)
        },
      },
    },
  })

export const queryClient = createQueryClient()
