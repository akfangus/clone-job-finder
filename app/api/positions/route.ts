import { NextResponse } from 'next/server'
import { fetchJobs } from '@/shared/api'
import { createServerAdminClient } from '@/shared/lib/supabase/server'

type CategoryQueryKey = 'all' | 'dev' | 'design' | 'marketing'

function mapCategoryKeyToDbValue(categoryKey: CategoryQueryKey | undefined): string | undefined {
  if (!categoryKey || categoryKey === 'all') return undefined

  switch (categoryKey) {
    case 'dev':
      return '개발'
    case 'design':
      return '디자인'
    case 'marketing':
      return '마케팅'
    default:
      return undefined
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)

  const categoryKey = (searchParams.get('category') ?? undefined) as CategoryQueryKey | undefined
  const limitParam = searchParams.get('limit')
  const offsetParam = searchParams.get('offset')

  const limit = limitParam ? Number(limitParam) : undefined
  const offset = offsetParam ? Number(offsetParam) : undefined

  try {
    const dbCategory = mapCategoryKeyToDbValue(categoryKey)

    const { jobs } = await fetchJobs({
      category: dbCategory,
      limit,
      offset,
    })

    return NextResponse.json(
      {
        jobs,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: '채용 정보를 불러오는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}

interface CreateJobPayload {
  companyName: string
  title: string
  categoryKey: CategoryQueryKey
  employmentType?: string
  location?: string
  summary?: string
  description?: string
  salaryRange?: string
  experienceLevel?: string
  workType?: string
  minYearsExperience?: number
  maxYearsExperience?: number
  applyUrl?: string
  deadline?: string
  tags?: string[]
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload = (await request.json()) as CreateJobPayload

    if (!payload.companyName || !payload.title) {
      return NextResponse.json(
        { message: '회사명과 포지션 제목은 필수입니다.' },
        {
          status: 400,
        }
      )
    }

    const dbCategory = mapCategoryKeyToDbValue(payload.categoryKey)
    if (!dbCategory) {
      return NextResponse.json(
        { message: '유효하지 않은 카테고리입니다.' },
        {
          status: 400,
        }
      )
    }

    const supabase = createServerAdminClient()

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .upsert(
        {
          name: payload.companyName,
        },
        {
          onConflict: 'name',
        }
      )
      .select('id')
      .single()

    if (companyError || !company) {
      throw new Error(companyError?.message ?? '회사 정보를 생성하는 중 오류가 발생했습니다.')
    }

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        company_id: company.id,
        title: payload.title,
        category: dbCategory,
        employment_type: payload.employmentType ?? null,
        location: payload.location ?? null,
        summary: payload.summary ?? null,
        description: payload.description ?? '',
        salary_range: payload.salaryRange ?? null,
        experience_level: payload.experienceLevel ?? null,
        work_type: payload.workType ?? null,
        min_years_experience: payload.minYearsExperience ?? null,
        max_years_experience: payload.maxYearsExperience ?? null,
        apply_url: payload.applyUrl ?? null,
        deadline: payload.deadline ?? null,
        tags: payload.tags && payload.tags.length > 0 ? payload.tags : null,
        is_active: true,
      })
      .select('id')
      .single()

    if (jobError || !job) {
      throw new Error(jobError?.message ?? '채용 공고를 생성하는 중 오류가 발생했습니다.')
    }

    return NextResponse.json(
      {
        id: job.id,
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        message: '채용 공고를 생성하는 중 알 수 없는 오류가 발생했습니다.',
      },
      {
        status: 500,
      }
    )
  }
}


