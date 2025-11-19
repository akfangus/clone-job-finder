import { createServerAdminClient } from '../lib/supabase/server'

export interface Company {
  id: string
  publicId: number | null
  name: string
  logoUrl: string | null
  homepageUrl: string | null
}

export interface Job {
  id: string
  publicId: number | null
  companyId: string
  companyPublicId: number | null
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

export interface JobDetail extends Job {
  summary: string | null
  experienceLevel: string | null
  workType: string | null
  minYearsExperience: number | null
  maxYearsExperience: number | null
  applyUrl: string | null
  deadline: string | null
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
}

export interface FetchJobsOptions {
  category?: string
  limit?: number
  offset?: number
}

export interface FetchJobsResult {
  jobs: Job[]
}

function mapRowToJob(row: Record<string, unknown>): Job {
  const company = row.companies as
    | {
        id: string
        public_id: number | null
        name: string
        logo_url: string | null
        homepage_url: string | null
      }
    | null
    | undefined

  return {
    id: String(row.id),
    publicId: row.public_id === null || row.public_id === undefined ? null : Number(row.public_id),
    companyId: String(row.company_id),
    companyPublicId:
      company && company.public_id !== null && company.public_id !== undefined ? Number(company.public_id) : null,
    companyName: String(company?.name ?? ''),
    companyLogoUrl: (company?.logo_url as string | null) ?? null,
    title: String(row.title),
    category: String(row.category),
    employmentType: (row.employment_type as string | null) ?? null,
    location: String(row.location),
    description: String(row.description),
    salaryRange: (row.salary_range as string | null) ?? null,
    tags: (Array.isArray(row.tags) ? (row.tags as string[]) : []) ?? [],
    createdAt: String(row.created_at),
  }
}

export async function fetchJobs(options: FetchJobsOptions = {}): Promise<FetchJobsResult> {
  const supabase = createServerAdminClient()

  let query = supabase
    .from('jobs')
    .select(
      `
        id,
        public_id,
        company_id,
        title,
        category,
        employment_type,
        location,
        description,
        salary_range,
        tags,
        created_at,
        companies:company_id (
          id,
          public_id,
          name,
          logo_url,
          homepage_url
        )
      `,
      {
        count: 'exact',
      }
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (options.category) {
    query = query.eq('category', options.category)
  }

  if (typeof options.limit === 'number' && typeof options.offset === 'number') {
    query = query.range(options.offset, options.offset + options.limit - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  const jobs =
    data?.map((row) => {
      return mapRowToJob(row as unknown as Record<string, unknown>)
    }) ?? []

  return { jobs }
}

export async function fetchJobByPublicId(publicId: number): Promise<JobDetail | null> {
  const supabase = createServerAdminClient()

  const { data, error } = await supabase
    .from('jobs')
    .select(
      `
        id,
        public_id,
        company_id,
        title,
        category,
        employment_type,
        location,
        description,
        salary_range,
        tags,
        created_at,
        summary,
        experience_level,
        work_type,
        min_years_experience,
        max_years_experience,
        apply_url,
        deadline,
        responsibilities,
        requirements,
        benefits,
        companies:company_id (
          id,
          public_id,
          name,
          logo_url,
          homepage_url
        )
      `
    )
    .eq('public_id', publicId)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    if (error.code === 'PGRST116') {
      // no rows found
      return null
    }
    throw new Error(error.message)
  }

  if (!data) {
    return null
  }

  const base = mapRowToJob(data as unknown as Record<string, unknown>)

  return {
    ...base,
    summary: (data.summary as string | null) ?? null,
    experienceLevel: (data.experience_level as string | null) ?? null,
    workType: (data.work_type as string | null) ?? null,
    minYearsExperience:
      data.min_years_experience === null || data.min_years_experience === undefined
        ? null
        : Number(data.min_years_experience),
    maxYearsExperience:
      data.max_years_experience === null || data.max_years_experience === undefined
        ? null
        : Number(data.max_years_experience),
    applyUrl: (data.apply_url as string | null) ?? null,
    deadline: data.deadline ? String(data.deadline) : null,
    responsibilities: Array.isArray(data.responsibilities) ? (data.responsibilities as string[]) : [],
    requirements: Array.isArray(data.requirements) ? (data.requirements as string[]) : [],
    benefits: Array.isArray(data.benefits) ? (data.benefits as string[]) : [],
  }
}
