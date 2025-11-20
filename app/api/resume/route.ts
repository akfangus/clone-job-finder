import { NextResponse } from 'next/server'
import { createServerClient } from '@/shared/lib/supabase/server'
import { getResumeByUserId, upsertResumeForUser } from '@/shared/api/resume-service'
import type { ResumeUpsertPayload } from '@/shared/api/resume-service'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const resume = await getResumeByUserId(user.id, supabase)
    return NextResponse.json({ resume })
  } catch (error) {
    console.error('GET /api/resume error:', error)
    return NextResponse.json({ error: '이력서를 불러오지 못했습니다.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const body = (await request.json()) as ResumeUpsertPayload

    if (!body?.fullName) {
      return NextResponse.json({ error: '이름은 필수입니다.' }, { status: 400 })
    }

    const resume = await upsertResumeForUser(user.id, body, supabase)

    return NextResponse.json({ resume })
  } catch (error) {
    console.error('PUT /api/resume error:', error)
    return NextResponse.json({ error: '이력서 저장 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
