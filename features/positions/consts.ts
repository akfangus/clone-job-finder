export const JOB_CATEGORIES = ['전체', '개발', '디자인', '마케팅'] as const

export type JobCategoryFilter = (typeof JOB_CATEGORIES)[number]
