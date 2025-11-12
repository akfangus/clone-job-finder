'use client'

import { memo, useEffect, useState } from 'react'

const BANNER_MESSAGES = [
  '좋은 인재들과 팀 문화를 만들며 협업하고 싶다면',
  '이직 노이즈 최소화 - 나에게 딱 맞는 조건의 이직 제안만 받아보세요',
  '스타트업 자동매칭 서비스 - 등록만 하면 쏟아지는 스타트업 채용 제안',
  '검증된 스타트업의 모든 정보를 한눈에 볼 수 있어요',
]

export const BannerIntro = memo(function BannerIntro() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      // 페이드 아웃
      setIsVisible(false)

      // 페이드 아웃 애니메이션 후 인덱스 변경
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % BANNER_MESSAGES.length)
        setIsVisible(true)
      }, 300) // 페이드 아웃 시간
    }, 3000) // 3초마다 변경

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <section className="relative w-full py-8 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="flex items-center justify-center px-4">
        <div
          className={`text-regular-16 md:text-regular-18 lg:text-regular-20 text-white text-center transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {BANNER_MESSAGES[currentIndex]}
        </div>
      </div>
    </section>
  )
})
