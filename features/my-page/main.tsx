'use client'

import type { ReactElement } from 'react'
import { useCallback } from 'react'
import type { Resume } from '@/shared/api/resume-service'
import { ResumeModal } from '@/features/my-page/components/resume-modal'
import { MyPageHero } from '@/features/my-page/components/my-page-hero'
import { AuthRequiredCard } from '@/features/my-page/components/auth-required-card'
import { ResumeDetailCard } from '@/features/my-page/components/resume-detail-card'
import { ResumeEmptyCard } from '@/features/my-page/components/resume-empty-card'
import { useResumeState } from '@/features/my-page/hooks/use-resume-state'
import { useAuthStore } from '@/modules/stores'

interface MyPageMainProps {
  resume: Resume | null
}

export function MyPageMain({ resume }: MyPageMainProps): ReactElement {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const {
    currentResume,
    isResumeModalOpen,
    openResumeModal,
    closeResumeModal,
    handleResumeSubmitted,
    setResumeModalOpen,
  } = useResumeState(resume)

  const handleModalOpenChange = useCallback(
    (open: boolean) => {
      setResumeModalOpen(open)
    },
    [setResumeModalOpen]
  )

  return (
    <main className="flex w-full max-w-3xl flex-col gap-8 mt-10 py-10 px-8 min-h-screen">
      <MyPageHero />

      {!isAuthenticated ? <AuthRequiredCard /> : null}

      {isAuthenticated ? (
        <>
          {currentResume ? (
            <ResumeDetailCard resume={currentResume} onEdit={openResumeModal} />
          ) : (
            <ResumeEmptyCard onCreate={openResumeModal} />
          )}

          <ResumeModal
            open={isResumeModalOpen}
            onOpenChange={handleModalOpenChange}
            initialResume={currentResume}
            onSubmitted={handleResumeSubmitted}
          />
        </>
      ) : null}
    </main>
  )
}
