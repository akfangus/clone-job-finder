'use client'

import type { ReactElement } from 'react'

export function AuthRequiredCard(): ReactElement {
  return (
    <section className="flex flex-col items-center justify-center gap-3 rounded-lg border bg-background/60 px-6 py-10 text-center">
      <h2 className="text-lg font-semibold">로그인이 필요합니다.</h2>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        마이페이지에서 이력서를 관리하려면 먼저 상단 메뉴에서 로그인해 주세요.
      </p>
    </section>
  )
}


