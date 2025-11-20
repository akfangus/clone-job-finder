'use client'

import type { ReactElement } from 'react'
import { Button } from '@/components/ui/button'

interface ResumeEmptyCardProps {
  onCreate: () => void
}

export function ResumeEmptyCard({ onCreate }: ResumeEmptyCardProps): ReactElement {
  return (
    <section className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-background/60 px-6 py-10 text-center">
      <h2 className="text-lg font-semibold">아직 등록된 이력서가 없습니다.</h2>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        첫 이력서를 작성해 보세요. 한 번만 등록하면 여러 포지션 지원 시 편리하게 활용할 수 있습니다.
      </p>
      <div className="mt-2">
        <Button size="lg" variant="default" className="bg-emerald-400 hover:bg-emerald-300" onClick={onCreate}>
          이력서 작성하기
        </Button>
      </div>
    </section>
  )
}
