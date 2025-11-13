'use client'

import { memo } from 'react'
import Image from 'next/image'

interface InvestorLogo {
  id: string
  name: string
  logoUrl: string
}

// 투자자 로고 데이터 (플레이스홀더 이미지 사용)
const INVESTOR_LOGOS: InvestorLogo[] = [
  { id: '1', name: '투자사 1', logoUrl: 'https://via.placeholder.com/150x80/4F46E5/FFFFFF?text=VC+Logo+1' },
  { id: '2', name: '투자사 2', logoUrl: 'https://via.placeholder.com/150x80/7C3AED/FFFFFF?text=VC+Logo+2' },
  { id: '3', name: '투자사 3', logoUrl: 'https://via.placeholder.com/150x80/EC4899/FFFFFF?text=VC+Logo+3' },
  { id: '4', name: '투자사 4', logoUrl: 'https://via.placeholder.com/150x80/F59E0B/FFFFFF?text=VC+Logo+4' },
  { id: '5', name: '투자사 5', logoUrl: 'https://via.placeholder.com/150x80/10B981/FFFFFF?text=VC+Logo+5' },
  { id: '6', name: '투자사 6', logoUrl: 'https://via.placeholder.com/150x80/3B82F6/FFFFFF?text=VC+Logo+6' },
]

// 무한 스크롤을 위해 로고를 복제
const DUPLICATED_LOGOS = [...INVESTOR_LOGOS, ...INVESTOR_LOGOS, ...INVESTOR_LOGOS]

export const Investor = memo(function Investor() {
  return (
    <section className="overflow-hidden relative py-12 w-full bg-white">
      <div className="flex flex-col gap-4 items-center px-4">
        <h2 className="text-center text-gray-900 font-heading-20 md:font-heading-24">
          아래 투자사에서 투자받은 스타트업에 지금 합류해보세요!
        </h2>

        {/* 무한 스크롤 컨테이너 */}
        <div className="overflow-hidden relative mt-8 w-full">
          {/* 그라데이션 오버레이 (양쪽 끝 페이드 효과) */}
          <div className="absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />

          {/* 스크롤 애니메이션 래퍼 */}
          <div className="flex gap-8 animate-scroll-infinite group hover:[animation-play-state:paused]">
            {DUPLICATED_LOGOS.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center w-[150px] h-[80px] px-4 bg-gray-50 rounded-lg border border-gray-200 transition-transform duration-300 group-hover:scale-105"
              >
                <Image
                  src={logo.logoUrl}
                  alt={logo.name}
                  width={150}
                  height={80}
                  className="object-contain max-w-full max-h-full"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-150px * ${INVESTOR_LOGOS.length} - 2rem * ${INVESTOR_LOGOS.length}));
          }
        }

        .animate-scroll-infinite {
          animation: scroll-infinite 30s linear infinite;
        }
      `}</style>
    </section>
  )
})
