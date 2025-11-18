'use client'
/* eslint-disable react/jsx-no-useless-fragment */
import type { JSX } from 'react'
import { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { usePositionsQuery, useGroupedPositionsByCategory } from '@/modules/queries/positions'
import { DataEmpty, DataError, DataLoading } from '@/components/data-fetching'
import { DEFAULT_JOB_CATEGORY_ID, getJobCategoryIdFromQueryParam, JobCategoryFilter } from '../consts'
import { CategoryTabs } from './category-tabs'
import { CategorySection } from './category-section'

export function PositionsPageContent(): JSX.Element {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const initialCategory = useMemo<JobCategoryFilter>(() => {
    const categoryParam = searchParams.get('category')
    return getJobCategoryIdFromQueryParam(categoryParam)
  }, [searchParams])

  const [selectedCategory, setSelectedCategory] = useState<JobCategoryFilter>(initialCategory)

  const {
    data: jobs,
    isLoading,
    isError,
  } = usePositionsQuery({
    category: selectedCategory === DEFAULT_JOB_CATEGORY_ID ? undefined : selectedCategory,
  })

  const grouped = useGroupedPositionsByCategory(jobs)

  const handleSelectCategory = (categoryId: JobCategoryFilter): void => {
    setSelectedCategory(categoryId)

    const nextSearchParams = new URLSearchParams(searchParams.toString())

    if (categoryId === DEFAULT_JOB_CATEGORY_ID) {
      nextSearchParams.delete('category')
    } else {
      nextSearchParams.set('category', categoryId)
    }

    const queryString = nextSearchParams.toString()
    const href = queryString ? `${pathname}?${queryString}` : pathname

    router.replace(href, { scroll: false })
  }

  return (
    <>
      <CategoryTabs selected={selectedCategory} onSelect={handleSelectCategory} />
      <div className="mt-8 min-h-[160px]">
        {isLoading && <DataLoading text="채용 정보를 불러오는 중입니다..." />}

        {isError && !isLoading && <DataError message="채용 정보를 불러오는 중 오류가 발생했습니다." />}

        {!isLoading && !isError && (!jobs || jobs.length === 0) && (
          <DataEmpty message="현재 등록된 채용 공고가 없습니다." />
        )}

        {!isLoading && !isError && jobs && jobs.length > 0 && (
          <div className="flex flex-col gap-10">
            {grouped.map((group) => (
              <CategorySection key={group.category} category={group.category} jobs={group.jobs} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
