import { useMemo } from 'react'
import type { JobGroupByCategory, JobItem } from './types'
import { groupBy } from 'lodash'

export function useGroupedPositionsByCategory(jobs: JobItem[] | undefined): JobGroupByCategory[] {
  const safeJobs = jobs ?? []

  return useMemo(() => {
    const grouped = groupBy(safeJobs, (job) => job.category)

    return Object.entries(grouped).map(([category, categoryJobs]) => ({
      category,
      jobs: categoryJobs,
    }))
  }, [safeJobs])
}
