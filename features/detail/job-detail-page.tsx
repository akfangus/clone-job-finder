import type { JSX } from 'react'

import dayjs from 'dayjs'

import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import type { JobDetail } from '@/shared/api'

import { JobDetailMetaItem } from './job-detail-meta-item'
import { formatYearsRange, renderListOrFallback } from './job-detail-utils'
import { JobDetailSection } from './job-detail-section'

interface JobDetailPageProps {
  job: JobDetail
}

export function JobDetailPage(props: JobDetailPageProps): JSX.Element {
  const { job } = props

  const formattedDeadline =
    job.deadline && dayjs(job.deadline).isValid() ? dayjs(job.deadline).format('YYYY.MM.DD') : null

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10">
      <section className="mb-8 border-b border-gray-100 pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-1 text-xs font-medium text-emerald-700">
              {job.companyName}
              {job.location ? ` · ${job.location}` : ''}
            </p>
            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">{job.title}</h1>
            {job.summary && <p className="max-w-2xl text-sm text-gray-700">{job.summary}</p>}

            {job.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.tags.map((tag) => (
                  <Tag key={tag} size="sm" variant="default">
                    #{tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            {formattedDeadline && (
              <p className="text-xs text-gray-500">
                마감일 <span className="font-medium text-gray-800">{formattedDeadline}</span>
              </p>
            )}
            {job.applyUrl && (
              <Button asChild size="lg" className="rounded-full px-6 text-sm font-medium">
                <a href={job.applyUrl} target="_blank" rel="noreferrer">
                  지원하기
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-xs text-gray-600 md:grid-cols-4">
          <JobDetailMetaItem label="직무" value={job.category} />
          <JobDetailMetaItem label="고용 형태" value={job.employmentType ?? '-'} />
          <JobDetailMetaItem label="경력" value={job.experienceLevel ?? '-'} />
          <JobDetailMetaItem label="근무 형태" value={job.workType ?? '-'} />
          <JobDetailMetaItem
            label="연차 범위"
            value={formatYearsRange(job.minYearsExperience, job.maxYearsExperience)}
          />
          <JobDetailMetaItem label="연봉 범위" value={job.salaryRange ?? '-'} />
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-[2fr,1.1fr]">
        <div className="space-y-8">
          <JobDetailSection title="하는 일">
            {renderListOrFallback(job.responsibilities, '담당 업무 정보가 아직 등록되지 않았습니다.')}
          </JobDetailSection>

          <JobDetailSection title="자격 요건">
            {renderListOrFallback(job.requirements, '자격 요건 정보가 아직 등록되지 않았습니다.')}
          </JobDetailSection>

          <JobDetailSection title="복지 및 혜택">
            {renderListOrFallback(job.benefits, '복지/혜택 정보가 아직 등록되지 않았습니다.')}
          </JobDetailSection>

          {job.description && (
            <JobDetailSection title="상세 설명">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{job.description}</p>
            </JobDetailSection>
          )}
        </div>

        <aside className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-xs text-gray-700">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">회사 정보</h2>
          <p className="font-medium text-gray-900">{job.companyName}</p>
          {job.location && <p className="text-gray-600">{job.location}</p>}
          {job.companyPublicId && <p className="text-gray-400">Company ID: {job.companyPublicId}</p>}
          {job.applyUrl && (
            <p className="mt-2 text-[11px] text-gray-500">
              이 포지션은 외부 페이지에서 지원이 진행됩니다. &quot;지원하기&quot; 버튼을 눌러 이동하세요.
            </p>
          )}
        </aside>
      </section>
    </main>
  )
}
