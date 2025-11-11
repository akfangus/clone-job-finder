import type { Metadata } from 'next'
import type { ReactElement, ReactNode } from 'react'
import localFont from 'next/font/local'
import './globals.css'
import { ReactQueryProvider } from '../shared/lib/tanstack-query'
import { ResponsiveContainer } from '@/components/layout'
import { Header } from '@/components/layout/header'
import { Navigation } from '@/components/navigation'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>): ReactElement {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} antialiased`}>
        <ReactQueryProvider>
          <ResponsiveContainer>
            <Header>
              <Navigation />
            </Header>
            {children}
          </ResponsiveContainer>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
