'use client'

import type { ReactElement, FormEvent } from 'react'
import { useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Resume } from '@/shared/api/resume-service'
import { useResumeForm } from '@/features/my-page/hooks/use-resume-form'
import { useResumeMutation } from '@/modules/queries/resume'

interface ResumeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialResume: Resume | null
  onSubmitted: (resume: Resume) => void
}

export function ResumeModal({ open, onOpenChange, initialResume, onSubmitted }: ResumeModalProps): ReactElement {
  const { values, isValid, handleChange, buildPayload } = useResumeForm(initialResume)
  const mutation = useResumeMutation({
    onSuccess: (resume) => {
      onSubmitted(resume)
      onOpenChange(false)
    },
  })

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!isValid || mutation.isPending) {
        return
      }

      const payload = buildPayload()
      mutation.mutate(payload)
    },
    [buildPayload, isValid, mutation]
  )

  const mode: 'create' | 'edit' = initialResume ? 'edit' : 'create'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? '이력서 작성' : '이력서 수정'}</DialogTitle>
          <DialogDescription>
            기본 프로필과 연락처, 핵심 요약을 간단히 입력해 주세요. 추후에 언제든지 다시 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                이름<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={values.fullName}
                onChange={handleChange('fullName')}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="홍길동"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">핸드폰 번호</label>
              <input
                type="tel"
                value={values.phone}
                onChange={handleChange('phone')}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">이메일</label>
              <input
                type="email"
                value={values.email}
                onChange={handleChange('email')}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="example@email.com"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">대표 직무 / 포지션</label>
              <input
                type="text"
                value={values.title}
                onChange={handleChange('title')}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="프론트엔드 개발자"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">한 줄 요약</label>
            <textarea
              value={values.summary}
              onChange={handleChange('summary')}
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="예: 5년 차 Next.js 기반 B2B SaaS 프론트엔드 개발자입니다."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">기술 스택</label>
            <textarea
              value={values.skillsInput}
              onChange={handleChange('skillsInput')}
              className="min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="예: React, TypeScript, Next.js, Tailwind CSS"
            />
            <p className="text-xs text-muted-foreground">콤마(,)로 구분해서 입력해 주세요.</p>
          </div>

          {mutation.isError ? (
            <p className="text-sm text-red-500">
              {(mutation.error as Error | null)?.message ?? '이력서 저장 중 오류가 발생했습니다.'}
            </p>
          ) : null}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isValid || mutation.isPending}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {mutation.isPending ? '저장 중...' : mode === 'create' ? '이력서 작성하기' : '이력서 저장하기'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


