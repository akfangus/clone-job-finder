import type { JSX } from 'react'

import { Tag } from '@/components/ui/tag'
import type { useGroupedPositionsByCategory } from '@/modules/queries/positions'

interface JobCardProps {
  job: ReturnType<typeof useGroupedPositionsByCategory>[number]['jobs'][number]
}

export function JobCard(props: JobCardProps) {
  const { job } = props

  return (
    <article className="flex cursor-pointer flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 text-xs font-medium text-gray-500">{job.companyName}</div>
      <h3 className="mb-2 text-sm font-semibold text-gray-900">{job.title}</h3>
      <div className="mb-3 text-xs text-gray-600">
        <span>{job.location}</span>
        {job.employmentType && <span className="mx-1 text-gray-400">·</span>}
        {job.employmentType && <span>{job.employmentType}</span>}
      </div>
      {job.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1">
          {job.tags.map((tag) => (
            <Tag key={tag} variant="default" size="sm">
              #{tag}
            </Tag>
          ))}
        </div>
      )}
    </article>
  )
}
