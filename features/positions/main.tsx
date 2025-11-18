import { Suspense } from 'react'
import { PositionsPageContent } from './components/positions-page-content'

export function PositionsMain() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10">
      <section className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">채용 공고</h1>
        <p className="mt-2 text-sm text-gray-600">직무 카테고리별로 최신 채용 공고를 확인해보세요.</p>
      </section>

      <Suspense fallback={<div className="text-sm text-gray-500">채용 정보를 불러오는 중입니다...</div>}>
        <PositionsPageContent />
      </Suspense>
    </main>
  )
}
