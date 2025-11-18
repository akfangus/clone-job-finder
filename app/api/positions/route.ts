import { NextResponse } from 'next/server'
import { fetchJobs } from '@/shared/api'

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category') ?? undefined
  const limitParam = searchParams.get('limit')
  const offsetParam = searchParams.get('offset')

  const limit = limitParam ? Number(limitParam) : undefined
  const offset = offsetParam ? Number(offsetParam) : undefined

  try {
    const { jobs } = await fetchJobs({
      category,
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


