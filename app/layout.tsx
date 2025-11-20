import type { Metadata } from 'next'
import type { ReactElement, ReactNode } from 'react'
import localFont from 'next/font/local'
import './globals.css'
import { ReactQueryProvider } from '../shared/lib/tanstack-query'
import { ResponsiveContainer } from '@/components/layout'
import { Header } from '@/components/layout/header'
import { Navigation } from '@/components/navigation'
import { AuthSessionRestorer } from '@/modules/components'
import { AuthStoreProvider } from '@/modules/stores'
import { createServerComponentClient } from '@/shared/lib/supabase'

const pretendard = localFont({
  src: [
    {
      path: '../public/fonts/PretendardVariable.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Clone-Job-Search',
  description: 'Clone-Job-Search',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>): Promise<ReactElement> {
  const supabase = await createServerComponentClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const initialUser = user ?? null
  const initialIsAuthenticated = !!initialUser

  return (
    <html lang="ko">
      <body className={`${pretendard.variable} antialiased `}>
        <ReactQueryProvider>
          <AuthStoreProvider
            initialUser={initialUser}
            initialIsAuthenticated={initialIsAuthenticated}
            initialIsLoading={false}
          >
            <AuthSessionRestorer />
            <ResponsiveContainer>
              <Header>
                <Navigation />
              </Header>
              {children}
            </ResponsiveContainer>
          </AuthStoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
