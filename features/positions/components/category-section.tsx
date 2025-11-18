import { useGroupedPositionsByCategory } from '@/modules/queries/positions'
import { JobCard } from './job-card'

interface CategorySectionProps {
  category: string
  jobs: ReturnType<typeof useGroupedPositionsByCategory>[number]['jobs']
}

export function CategorySection(props: CategorySectionProps) {
  const { category, jobs } = props

  return (
    <section>
      <div className="grid gap-4 md:grid-cols-1">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  )
}
