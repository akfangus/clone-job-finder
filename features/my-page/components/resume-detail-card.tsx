'use client'

import type { ReactElement } from 'react'
import dayjs from 'dayjs'
import type { Resume } from '@/shared/api/resume-service'
import { Button } from '@/components/ui/button'

interface ResumeDetailCardProps {
  resume: Resume
  onEdit: () => void
}

export function ResumeDetailCard({ resume, onEdit }: ResumeDetailCardProps): ReactElement {
  const lastUpdatedLabel = dayjs(resume.updatedAt).isValid() ? dayjs(resume.updatedAt).format('YYYY.MM.DD HH:mm') : null

  return (
    <section className="rounded-lg border bg-background px-6 py-5 shadow-sm">
      <header className="flex flex-col gap-1 border-b pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">{resume.fullName}</h2>
            {resume.title ? <p className="text-sm text-muted-foreground">{resume.title}</p> : null}
          </div>
          <div className="flex items-center gap-3">
            {lastUpdatedLabel ? <p className="text-xs text-muted-foreground">최근 수정 {lastUpdatedLabel}</p> : null}
            <Button variant="outline" size="sm" onClick={onEdit}>
              이력서 수정
            </Button>
          </div>
        </div>
        {resume.summary ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{resume.summary}</p> : null}
      </header>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-1 text-sm">
          <p className="font-medium text-muted-foreground">연락처</p>
          <div className="rounded-md bg-muted px-3 py-2">
            <p className="text-sm">{resume.phone || '연락처 미입력'}</p>
            <p className="text-xs text-muted-foreground">{resume.email || '이메일 미입력'}</p>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <p className="font-medium text-muted-foreground">기술 스택</p>
          <div className="flex flex-wrap gap-2">
            {resume.skills.length > 0 ? (
              resume.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">등록된 기술 스택이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
