'use client'

import { memo } from 'react'
import Image from 'next/image'

interface StartupLogo {
  id: string
  name: string
  logoUrl: string
  description?: string
}

// 스타트업 로고 데이터 (플레이스홀더 이미지 사용)
const STARTUP_LOGOS: StartupLogo[] = [
  {
    id: '1',
    name: '타인에이아이',
    logoUrl: 'https://via.placeholder.com/200x100/6366F1/FFFFFF?text=타인에이아이',
    description: 'AI 캐릭터 채팅 서비스',
  },
  {
    id: '2',
    name: '혜움',
    logoUrl: 'https://via.placeholder.com/200x100/8B5CF6/FFFFFF?text=혜움',
    description: 'B2B 금융 AI 스타트업',
  },
  {
    id: '3',
    name: '티엠알파운더스',
    logoUrl: 'https://via.placeholder.com/200x100/EC4899/FFFFFF?text=TMR',
    description: '테이블오더 혁신',
  },
  {
    id: '4',
    name: '스타트업 4',
    logoUrl: 'https://via.placeholder.com/200x100/F59E0B/FFFFFF?text=Startup+4',
  },
  {
    id: '5',
    name: '스타트업 5',
    logoUrl: 'https://via.placeholder.com/200x100/10B981/FFFFFF?text=Startup+5',
  },
  {
    id: '6',
    name: '스타트업 6',
    logoUrl: 'https://via.placeholder.com/200x100/3B82F6/FFFFFF?text=Startup+6',
  },
  {
    id: '7',
    name: '스타트업 7',
    logoUrl: 'https://via.placeholder.com/200x100/EF4444/FFFFFF?text=Startup+7',
  },
  {
    id: '8',
    name: '스타트업 8',
    logoUrl: 'https://via.placeholder.com/200x100/14B8A6/FFFFFF?text=Startup+8',
  },
]

export const JoinStartup = memo(function JoinStartup() {
  return (
    <section className="relative w-full py-16 px-4 bg-white">
      <div className="flex flex-col items-center gap-8 max-w-6xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-heading-24 md:text-heading-30 lg:text-heading-32 text-gray-900">
            그룹바이를 통해서 합류한
            <br />
            검증된 스타트업은 이렇다고 해요
          </h2>
        </div>

        {/* 스타트업 로고 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {STARTUP_LOGOS.map((startup) => (
            <div
              key={startup.id}
              className="group relative flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-300 cursor-pointer"
            >
              {/* 로고 이미지 */}
              <div className="relative w-full h-24 flex items-center justify-center">
                <Image
                  src={startup.logoUrl}
                  alt={startup.name}
                  width={200}
                  height={100}
                  className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* 스타트업 이름 */}
              <h3 className="text-regular-14 md:text-regular-16 text-gray-700 text-center font-medium">
                {startup.name}
              </h3>

              {/* 설명 (있는 경우) */}
              {startup.description && (
                <p className="text-regular-12 text-gray-500 text-center">{startup.description}</p>
              )}

              {/* 호버 시 오버레이 효과 */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* CTA 섹션 */}
        <div className="flex flex-col items-center gap-4 mt-8 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <p className="text-regular-18 md:text-regular-20 text-gray-700 text-center">
            희망 구직 조건을 등록하고, 딱 맞는 제안만 받아보세요!
          </p>
          <button
            type="button"
            className="px-6 py-3 text-regular-16 font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            👉🏻 3초만에 가입하고 스카우트 제안받기
          </button>
        </div>
      </div>
    </section>
  )
})
