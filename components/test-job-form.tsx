'use client'

import { useState } from 'react'

import { DataError } from '@/components/data-fetching'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DEFAULT_JOB_CATEGORY_ID, JOB_CATEGORY_CONFIG, type JobCategoryId } from '../features/positions/consts'

interface CreateJobPayload {
  companyName: string
  title: string
  categoryKey: JobCategoryId
  employmentType: string
  location: string
  summary: string
  description: string
  salaryRange: string
  experienceLevel: string
  workType: string
  minYearsExperience?: number
  maxYearsExperience?: number
  applyUrl?: string
  deadline?: string
  tags: string[]
}

export function TestJobForm() {
  const [companyName, setCompanyName] = useState<string>('혜움')
  const [title, setTitle] = useState<string>('')
  const [categoryKey, setCategoryKey] = useState<JobCategoryId>(DEFAULT_JOB_CATEGORY_ID)
  const [employmentType, setEmploymentType] = useState<string>('정규직')
  const [location, setLocation] = useState<string>('서울')
  const [summary, setSummary] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [salaryRange, setSalaryRange] = useState<string>('')
  const [experienceLevel, setExperienceLevel] = useState<string>('미들')
  const [workType, setWorkType] = useState<string>('하이브리드')
  const [minYearsExperience, setMinYearsExperience] = useState<string>('')
  const [maxYearsExperience, setMaxYearsExperience] = useState<string>('')
  const [applyUrl, setApplyUrl] = useState<string>('')
  const [deadline, setDeadline] = useState<string>('')
  const [tagsText, setTagsText] = useState<string>('')

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    const tags =
      tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean) ?? []

    const payload: CreateJobPayload = {
      companyName,
      title,
      categoryKey,
      employmentType,
      location,
      summary,
      description,
      salaryRange,
      experienceLevel,
      workType,
      minYearsExperience: minYearsExperience ? Number(minYearsExperience) : undefined,
      maxYearsExperience: maxYearsExperience ? Number(maxYearsExperience) : undefined,
      applyUrl: applyUrl || undefined,
      deadline: deadline || undefined,
      tags,
    }

    try {
      const response = await fetch('/api/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null
        const message = data?.message ?? '채용 공고 생성에 실패했습니다.'
        throw new Error(message)
      }

      setSuccessMessage('채용 공고가 성공적으로 추가되었습니다.')
      setTitle('')
      setSummary('')
      setDescription('')
      setSalaryRange('')
      setMinYearsExperience('')
      setMaxYearsExperience('')
      setApplyUrl('')
      setDeadline('')
      setTagsText('')
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col px-4 py-6">
      <section className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">테스트용 채용 공고 생성</h1>
        <p className="mt-2 text-sm text-gray-600">
          Supabase jobs 테이블에 직접 테스트 데이터를 추가하기 위한 폼입니다.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">회사명</label>
            <Input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="회사명"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">직무 카테고리</label>
            <select
              className="h-9 w-full rounded-md border border-gray-200 px-2 text-xs"
              value={categoryKey}
              onChange={(event) => setCategoryKey(event.target.value as JobCategoryId)}
            >
              {JOB_CATEGORY_CONFIG.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">포지션 제목</label>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="예) 프론트엔드 개발자"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">고용 형태</label>
            <Input
              value={employmentType}
              onChange={(event) => setEmploymentType(event.target.value)}
              placeholder="예) 정규직"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">근무 지역</label>
            <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="예) 서울" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">연봉 범위</label>
            <Input
              value={salaryRange}
              onChange={(event) => setSalaryRange(event.target.value)}
              placeholder="예) 5,000만원~7,000만원"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">경력 레벨</label>
            <Input
              value={experienceLevel}
              onChange={(event) => setExperienceLevel(event.target.value)}
              placeholder="예) 주니어 / 미들 / 시니어"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">최소 연차</label>
            <Input
              type="number"
              value={minYearsExperience}
              onChange={(event) => setMinYearsExperience(event.target.value)}
              min={0}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">최대 연차</label>
            <Input
              type="number"
              value={maxYearsExperience}
              onChange={(event) => setMaxYearsExperience(event.target.value)}
              min={0}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">근무 형태</label>
            <Input
              value={workType}
              onChange={(event) => setWorkType(event.target.value)}
              placeholder="예) 오피스 / 하이브리드 / 리모트"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">마감일 (YYYY-MM-DD)</label>
            <Input
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              placeholder="예) 2025-06-30"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">요약</label>
            <Input
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="리스트/상단 카드에 노출할 한 줄 요약"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">태그 (쉼표로 구분)</label>
            <Input
              value={tagsText}
              onChange={(event) => setTagsText(event.target.value)}
              placeholder="예) React, TypeScript, Next.js"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">상세 설명</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[72px] w-full rounded-md border border-gray-200 p-2 text-xs"
              placeholder="포지션에 대한 상세 설명"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">지원 링크 (선택)</label>
            <Input value={applyUrl} onChange={(event) => setApplyUrl(event.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting || !title}>
            {isSubmitting ? '저장 중...' : '채용 공고 추가'}
          </Button>
          {successMessage && <span className="text-xs text-emerald-600">{successMessage}</span>}
        </div>

        {errorMessage && (
          <div>
            <DataError message={errorMessage} />
          </div>
        )}
      </form>
    </main>
  )
}
