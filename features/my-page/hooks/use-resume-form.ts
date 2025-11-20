import { useCallback, useEffect, useState } from 'react'
import compact from 'lodash/compact'
import type { Resume, ResumeUpsertPayload } from '@/shared/api/resume-service'

interface ResumeFormValues {
  fullName: string
  phone: string
  email: string
  title: string
  summary: string
  skillsInput: string
}

function createInitialValues(resume: Resume | null): ResumeFormValues {
  if (!resume) {
    return {
      fullName: '',
      phone: '',
      email: '',
      title: '',
      summary: '',
      skillsInput: '',
    }
  }

  return {
    fullName: resume.fullName ?? '',
    phone: resume.phone ?? '',
    email: resume.email ?? '',
    title: resume.title ?? '',
    summary: resume.summary ?? '',
    skillsInput: resume.skills.join(', '),
  }
}

export interface UseResumeFormResult {
  values: ResumeFormValues
  isValid: boolean
  handleChange: (
    field: keyof ResumeFormValues
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  buildPayload: () => ResumeUpsertPayload
}

export function useResumeForm(initialResume: Resume | null): UseResumeFormResult {
  const [values, setValues] = useState<ResumeFormValues>(() => createInitialValues(initialResume))

  useEffect(() => {
    setValues(createInitialValues(initialResume))
  }, [initialResume])

  const handleChange: UseResumeFormResult['handleChange'] = useCallback(
    (field) => (event) => {
      const nextValue = event.target.value
      setValues((prev) => ({
        ...prev,
        [field]: nextValue,
      }))
    },
    []
  )

  const buildPayload: UseResumeFormResult['buildPayload'] = useCallback(() => {
    const skills =
      values.skillsInput.length > 0
        ? compact(
            values.skillsInput
              .split(',')
              .map((item) => item.trim())
              .filter((item) => item.length > 0)
          )
        : []

    const payload: ResumeUpsertPayload = {
      fullName: values.fullName.trim(),
      phone: values.phone.trim() || null,
      email: values.email.trim() || null,
      title: values.title.trim() || null,
      summary: values.summary.trim() || null,
      skills,
      experiences: null,
      educations: null,
      links: null,
    }

    return payload
  }, [values])

  const isValid = values.fullName.trim().length > 0

  return {
    values,
    isValid,
    handleChange,
    buildPayload,
  }
}


