import dayjs from 'dayjs'
import { HomeQuerySection } from '../features/home'

export default function Home() {
  const serverRenderedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-[40px] bg-gray-50 p-[40px]">
      <section className="w-full max-w-[480px] rounded-[16px] border border-gray-200 bg-white p-[24px] shadow-sm">
        <h1 className="text-gray-900 text-regular-24">React Query App Router 예시</h1>
        <p className="mt-[12px] text-regular-16 text-gray-600">
          이 페이지는 기본적으로 서버 컴포넌트로 렌더링되고, 아래 섹션에서 클라이언트 컴포넌트가{' '}
          <code className="rounded-[6px] bg-gray-100 px-[8px] py-[2px]">useQuery</code>를 사용해 데이터를 불러옵니다.
        </p>
        <p className="mt-[16px] text-regular-14 text-gray-500">서버 렌더링 완료 시각: {serverRenderedAt}</p>
      </section>

      <HomeQuerySection />
    </div>
  )
}
