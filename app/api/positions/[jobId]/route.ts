import { NextResponse } from 'next/server'

import { fetchJobByPublicId } from '@/shared/api'

export async function GET(
  _request: Request,
  context: { params: { jobId: string } }
): Promise<NextResponse> {
  const { jobId } = context.params

  const numericId = Number(jobId)
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json(
      {
        message: '유효하지 않은 포지션 ID입니다.',
      },
      {
        status: 400,
      }
    )
  }

  try {
    const job = await fetchJobByPublicId(numericId)

    if (!job) {
      return NextResponse.json(
        {
          message: '해당 포지션을 찾을 수 없습니다.',
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json(
      {
        job,
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
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        message: '포지션 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.',
      },
      {
        status: 500,
      }
    )
  }
}


