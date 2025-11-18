import { NextResponse } from 'next/server'
import { fetchJobs } from '@/shared/api'

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


