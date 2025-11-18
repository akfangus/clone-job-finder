export const JOB_CATEGORY_CONFIG = [
  { id: 'all', label: '전체' },
  { id: 'dev', label: '개발', dbValue: '개발' },
  { id: 'design', label: '디자인', dbValue: '디자인' },
  { id: 'marketing', label: '마케팅', dbValue: '마케팅' },
] as const

export type JobCategoryId = (typeof JOB_CATEGORY_CONFIG)[number]['id']

export const DEFAULT_JOB_CATEGORY_ID: JobCategoryId = 'all'

export const JOB_CATEGORIES = JOB_CATEGORY_CONFIG.map((item) => item.id)

export type JobCategoryFilter = JobCategoryId

export function getJobCategoryLabelById(id: JobCategoryId): string {
  const found = JOB_CATEGORY_CONFIG.find((item) => item.id === id)
  return found?.label ?? id
}

export function getJobCategoryIdFromQueryParam(param: string | null): JobCategoryId {
  const found = JOB_CATEGORY_CONFIG.find((item) => item.id === param)
  if (found) return found.id
  return DEFAULT_JOB_CATEGORY_ID
}
