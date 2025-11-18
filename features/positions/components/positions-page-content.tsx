'use client'
/* eslint-disable react/jsx-no-useless-fragment */
import type { JSX } from 'react'
import { useState } from 'react'
import { usePositionsQuery, useGroupedPositionsByCategory } from '@/modules/queries/positions'
import { JobCategoryFilter } from '../consts'
import { CategoryTabs } from './category-tabs'
import { CategorySection } from './category-section'

function mapCategoryFilterToParam(category: JobCategoryFilter): string | undefined {
  if (category === '전체') return undefined
  return category
}

export function PositionsPageContent(): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<JobCategoryFilter>('전체')

  const categoryParam = mapCategoryFilterToParam(selectedCategory)

  const {
    data: jobs,
    isLoading,
    isError,
  } = usePositionsQuery({
    category: categoryParam,
  })

  const grouped = useGroupedPositionsByCategory(jobs)

  if (isLoading) {
    return <div className="text-sm text-gray-500">채용 정보를 불러오는 중입니다...</div>
  }

  if (isError) {
    return <div className="text-sm text-red-500">채용 정보를 불러오는 중 오류가 발생했습니다.</div>
  }

  if (!jobs || jobs.length === 0) {
    return <div className="text-sm text-gray-500">현재 등록된 채용 공고가 없습니다.</div>
  }

  return (
    <>
      <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
      <div className="mt-8 flex flex-col gap-10">
        {grouped.map((group) => (
          <CategorySection key={group.category} category={group.category} jobs={group.jobs} />
        ))}
      </div>
    </>
  )
}
