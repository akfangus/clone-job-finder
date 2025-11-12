'use client'

import { memo, useCallback, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ServicePlan {
  id: number
  title: string
  description: string
  features: string[]
  icon: string
  color: string
}

const SERVICE_PLANS: ServicePlan[] = [
  {
    id: 1,
    title: '이직 노이즈 최소화',
    description: '나에게 딱 맞는 조건의 이직 제안만 받아보세요',
    features: [
      '조건을 등록해놓고 만족하는 이직 제안만 받기',
      '원하지 않는 제안은 자동으로 필터링',
      '개인화된 맞춤 제안 시스템',
    ],
    icon: '🎯',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    title: '스타트업 자동매칭',
    description: '등록만 하면 쏟아지는 스타트업 채용 제안',
    features: [
      '채용 서비스에서 정보를 찾을 필요 없음',
      '스타트업이 알아서 찾아옴',
      '시간 절약과 효율적인 채용 프로세스',
    ],
    icon: '🤝',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 3,
    title: '검증된 스타트업 정보',
    description: 'VC에게 투자받은 성공 보장 스타트업 정보를 한눈에',
    features: ['VC 투자 정보 확인 가능', '스타트업의 모든 정보 제공', '투명한 정보 공개'],
    icon: '✅',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 4,
    title: '이직 올인원 프로세스',
    description: '소통부터 일정 조율까지 한번에',
    features: ['이메일, 전화로 복잡하게 소통할 필요 없음', '소통부터 일정 조율까지 통합 관리', '간편한 프로세스'],
    icon: '🚀',
    color: 'from-orange-500 to-orange-600',
  },
]

export const ProjectPlan = memo(function ProjectPlan() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? SERVICE_PLANS.length - 1 : prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === SERVICE_PLANS.length - 1 ? 0 : prev + 1))
  }, [])

  const handleIndicatorClick = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // 터치 이벤트 처리
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    }
    if (isRightSwipe) {
      handlePrevious()
    }
  }, [touchStart, touchEnd, handleNext, handlePrevious])

  return (
    <section className="relative w-full py-16 px-4 bg-gray-50">
      <div className="flex flex-col items-center gap-8 max-w-6xl mx-auto">
        <h2 className="text-heading-24 md:text-heading-30 lg:text-heading-32 text-gray-900 text-center">
          좋은 인재들과 팀 문화를 만들며 협업하고 싶다면
        </h2>

        {/* 카드 슬라이더 컨테이너 */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {SERVICE_PLANS.map((plan) => (
              <div key={plan.id} className="flex-shrink-0 w-full px-4">
                <div
                  className={`relative flex flex-col gap-6 p-8 rounded-2xl bg-gradient-to-br ${plan.color} text-white shadow-xl min-h-[400px]`}
                >
                  {/* 아이콘 */}
                  <div className="text-6xl">{plan.icon}</div>

                  {/* 제목 */}
                  <h3 className="text-heading-24 md:text-heading-28 text-white">{plan.title}</h3>

                  {/* 설명 */}
                  <p className="text-regular-16 md:text-regular-18 text-white/90">{plan.description}</p>

                  {/* 기능 리스트 */}
                  <ul className="flex flex-col gap-3 mt-auto">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-regular-14 md:text-regular-16">
                        <span className="mt-1 text-xl">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="size-10 rounded-full"
            aria-label="이전 플랜"
          >
            <ChevronLeft className="size-5" />
          </Button>

          {/* 인디케이터 */}
          <div className="flex gap-2">
            {SERVICE_PLANS.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleIndicatorClick(index)}
                className={`size-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
                }`}
                aria-label={`플랜 ${index + 1}로 이동`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="size-10 rounded-full"
            aria-label="다음 플랜"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    </section>
  )
})
