'use client'

import { useCallback, useState } from 'react'
import type { Resume } from '@/shared/api/resume-service'

export interface UseResumeStateResult {
  currentResume: Resume | null
  isResumeModalOpen: boolean
  openResumeModal: () => void
  closeResumeModal: () => void
  handleResumeSubmitted: (resume: Resume) => void
  setResumeModalOpen: (open: boolean) => void
}

export function useResumeState(initialResume: Resume | null): UseResumeStateResult {
  const [currentResume, setCurrentResume] = useState<Resume | null>(initialResume)
  const [isResumeModalOpen, setResumeModalOpen] = useState<boolean>(false)

  const openResumeModal = useCallback(() => {
    setResumeModalOpen(true)
  }, [])

  const closeResumeModal = useCallback(() => {
    setResumeModalOpen(false)
  }, [])

  const handleResumeSubmitted = useCallback((resume: Resume) => {
    setCurrentResume(resume)
    setResumeModalOpen(false)
  }, [])

  return {
    currentResume,
    isResumeModalOpen,
    openResumeModal,
    closeResumeModal,
    handleResumeSubmitted,
    setResumeModalOpen,
  }
}


