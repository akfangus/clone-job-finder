export interface JobItem {
  id: string
  companyId: string
  companyName: string
  companyLogoUrl: string | null
  title: string
  category: string
  employmentType: string | null
  location: string
  description: string
  salaryRange: string | null
  tags: string[]
  createdAt: string
}

export interface PositionsResponse {
  jobs: JobItem[]
}

export interface UsePositionsQueryParams {
  category?: string
}

export interface JobGroupByCategory {
  category: string
  jobs: JobItem[]
}


