import { useGroupedPositionsByCategory } from '@/modules/queries/positions'

interface CategorySectionProps {
  category: string
  jobs: ReturnType<typeof useGroupedPositionsByCategory>[number]['jobs']
}

export function CategorySection(props: CategorySectionProps) {
  const { category, jobs } = props

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-gray-900">{category}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="flex flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
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
                  <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
