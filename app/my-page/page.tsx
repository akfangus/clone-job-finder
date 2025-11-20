import { MyPageMain } from '@/features/my-page'
import { createServerComponentClient } from '@/shared/lib/supabase'
import { getResumeByUserId } from '@/shared/api/resume-service'

export default async function MyPage() {
  const supabase = await createServerComponentClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const resume = !error && user ? await getResumeByUserId(user.id, supabase) : null

  return <MyPageMain resume={resume} />
}
