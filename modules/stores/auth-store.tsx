'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { createStore, useStore } from 'zustand'
import type { StoreApi } from 'zustand'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  setUser: (user: User | null) => void
  setLoading: (isLoading: boolean) => void
  login: (user: User) => void
  logout: () => void
  clearAuth: () => void
}

interface AuthStoreProviderProps {
  initialUser: User | null
  initialIsAuthenticated?: boolean
  initialIsLoading?: boolean
  children: ReactNode
}

type AuthStore = StoreApi<AuthState>

function createAuthStore(initialState?: Partial<AuthState>): AuthStore {
  return createStore<AuthState>((set) => ({
    user: initialState?.user ?? null,
    isLoading: initialState?.isLoading ?? false,
    isAuthenticated:
      typeof initialState?.isAuthenticated === 'boolean' ? initialState.isAuthenticated : !!initialState?.user,

    setUser: (user) =>
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      }),

    setLoading: (isLoading) =>
      set({
        isLoading,
      }),

    login: (user) =>
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      }),

    logout: () =>
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }),

    clearAuth: () =>
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }),
  }))
}

const AuthStoreContext = createContext<AuthStore | null>(null)

export function AuthStoreProvider({
  initialUser,
  initialIsAuthenticated,
  initialIsLoading,
  children,
}: AuthStoreProviderProps) {
  const storeRef = useRef<AuthStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = createAuthStore({
      user: initialUser,
      isAuthenticated: typeof initialIsAuthenticated === 'boolean' ? initialIsAuthenticated : !!initialUser,
      isLoading: initialIsLoading ?? false,
    })
  }

  return <AuthStoreContext.Provider value={storeRef.current}>{children}</AuthStoreContext.Provider>
}

export function useAuthStore<T = AuthState>(selector?: (state: AuthState) => T): T {
  const store = useContext(AuthStoreContext)

  if (!store) {
    throw new Error('useAuthStore must be used within an AuthStoreProvider')
  }

  const boundSelector =
    selector ??
    ((state: AuthState) => {
      return state as unknown as T
    })

  return useStore(store, boundSelector)
}
