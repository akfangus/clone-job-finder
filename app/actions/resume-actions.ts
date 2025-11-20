'use server'

import { createServerClient } from '@/shared/lib/supabase/server'
import type { ActionResultUnion } from '@/shared/lib/types/action-result'
import type { Resume, ResumeUpsertPayload } from '@/shared/api/resume-service'
import { upsertResumeForUser } from '@/shared/api/resume-service'

export async function upsertMyResume(payload: ResumeUpsertPayload): Promise<ActionResultUnion<Resume>> {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return {
        success: false,
        error: '로그인이 필요합니다.',
      }
    }

    const resume = await upsertResumeForUser(user.id, payload)

    return {
      success: true,
      data: resume,
    }
  } catch (error) {
    console.error('upsertMyResume Server Action error:', error)
    return {
      success: false,
      error: '이력서 저장 중 오류가 발생했습니다.',
    }
  }
}


