import { useMutation } from '@tanstack/react-query'
import type { Resume, ResumeUpsertPayload } from '@/shared/api/resume-service'

interface UseResumeMutationOptions {
  onSuccess?: (resume: Resume) => void
}

export function useResumeMutation(options?: UseResumeMutationOptions) {
  return useMutation({
    mutationFn: async (payload: ResumeUpsertPayload) => {
      const response = await fetch('/api/resume', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as { error?: string } | null
        const message = errorBody?.error ?? '이력서 저장에 실패했습니다.'
        throw new Error(message)
      }

      const data = (await response.json()) as { resume: Resume }
      return data.resume
    },
    onSuccess: (resume) => {
      options?.onSuccess?.(resume)
    },
  })
}


