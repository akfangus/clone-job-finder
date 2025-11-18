import { createServerAdminClient } from '../lib/supabase/server'

export interface Company {
  id: string
  name: string
  logoUrl: string | null
  homepageUrl: string | null
}

export interface Job {
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

export interface FetchJobsOptions {
  category?: string
  limit?: number
  offset?: number
}

export interface FetchJobsResult {
  jobs: Job[]
}

function mapRowToJob(row: Record<string, unknown>): Job {
  return {
    id: String(row.id),
    companyId: String(row.company_id),
    companyName: String(row.company_name ?? ''),
    companyLogoUrl: (row.company_logo_url as string | null) ?? null,
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
      const companies = row.companies as unknown as {
        id: string
        name: string
        logo_url: string | null
        homepage_url: string | null
      } | null

      return mapRowToJob({
        ...row,
        company_name: companies?.name ?? '',
        company_logo_url: companies?.logo_url ?? null,
      })
    }) ?? []

  return { jobs }
}
