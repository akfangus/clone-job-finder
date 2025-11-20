import { useMutation } from '@tanstack/react-query'
import { upsertMyResume } from '@/app/actions/resume-actions'
import type { Resume, ResumeUpsertPayload } from '@/shared/api/resume-service'
import { unwrapActionResult } from '@/shared/lib/types/action-result'

interface UseResumeMutationOptions {
  onSuccess?: (resume: Resume) => void
}

export function useResumeMutation(options?: UseResumeMutationOptions) {
  return useMutation({
    mutationFn: async (payload: ResumeUpsertPayload) => {
      const result = await upsertMyResume(payload)
      return unwrapActionResult(result)
    },
    onSuccess: (resume) => {
      options?.onSuccess?.(resume)
    },
  })
}


