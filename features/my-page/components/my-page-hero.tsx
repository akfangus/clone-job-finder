'use client'

import type { ReactElement } from 'react'

export function MyPageHero(): ReactElement {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">마이페이지</h1>
      <p className="text-sm text-muted-foreground">이력서를 등록하면 지원 및 추천에 활용할 수 있어요.</p>
    </section>
  )
}
