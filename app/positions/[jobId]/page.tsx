import { notFound } from 'next/navigation'

import { JobDetailPage } from '@/features/detail/job-detail-page'
import { fetchJobByPublicId } from '@/shared/api'

interface JobDetailRouteProps {
  params: {
    jobId: string
  }
}

export default async function JobDetailRoute(props: JobDetailRouteProps) {
  const { jobId } = props.params

  const numericId = Number(jobId)

  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound()
  }

  const job = await fetchJobByPublicId(numericId)

  if (!job) {
    notFound()
  }

  return <JobDetailPage job={job} />
}
