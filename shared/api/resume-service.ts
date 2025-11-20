import { createServerAdminClient } from '../lib/supabase/server'

export interface Resume {
  id: string
  userId: string
  fullName: string
  phone: string | null
  email: string | null
  title: string | null
  summary: string | null
  experiences: unknown | null
  educations: unknown | null
  skills: string[]
  links: unknown | null
  createdAt: string
  updatedAt: string
}

export interface ResumeUpsertPayload {
  fullName: string
  phone?: string | null
  email?: string | null
  title?: string | null
  summary?: string | null
  experiences?: unknown | null
  educations?: unknown | null
  skills?: string[]
  links?: unknown | null
}

interface ResumeRow {
  id: string
  user_id: string
  full_name: string
  phone: string | null
  email: string | null
  title: string | null
  summary: string | null
  experiences: unknown | null
  educations: unknown | null
  skills: string[] | null
  links: unknown | null
  created_at: string
  updated_at: string
}

function mapRowToResume(row: ResumeRow): Resume {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    title: row.title,
    summary: row.summary,
    experiences: row.experiences,
    educations: row.educations,
    skills: row.skills ?? [],
    links: row.links,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getResumeByUserId(userId: string): Promise<Resume | null> {
  const supabase = createServerAdminClient()

  const { data, error } = await supabase
    .from('resumes')
    .select(
      `
        id,
        user_id,
        full_name,
        phone,
        email,
        title,
        summary,
        experiences,
        educations,
        skills,
        links,
        created_at,
        updated_at
      `
    )
    .eq('user_id', userId)
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

  return mapRowToResume(data as ResumeRow)
}

export async function upsertResumeForUser(userId: string, payload: ResumeUpsertPayload): Promise<Resume> {
  const supabase = createServerAdminClient()

  const { data, error } = await supabase
    .from('resumes')
    .upsert(
      {
        user_id: userId,
        full_name: payload.fullName,
        phone: payload.phone ?? null,
        email: payload.email ?? null,
        title: payload.title ?? null,
        summary: payload.summary ?? null,
        experiences: payload.experiences ?? null,
        educations: payload.educations ?? null,
        skills: payload.skills ?? [],
        links: payload.links ?? null,
      },
      {
        onConflict: 'user_id',
      }
    )
    .select(
      `
        id,
        user_id,
        full_name,
        phone,
        email,
        title,
        summary,
        experiences,
        educations,
        skills,
        links,
        created_at,
        updated_at
      `
    )
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('이력서 저장에 실패했습니다.')
  }

  return mapRowToResume(data as ResumeRow)
}


