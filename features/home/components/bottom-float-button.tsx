'use client'

import { memo, useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import throttle from 'lodash/throttle'

export const BottomFloatButton = memo(function BottomFloatButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (typeof window === 'undefined') return

      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollThreshold = windowHeight // 화면 높이만큼 스크롤했을 때
      const hideThreshold = documentHeight - windowHeight - 100 // 최하단 100px 전에 사라짐

      // 화면 높이만큼 스크롤했고, 최하단에 도달하기 전이면 표시
      const shouldShow = scrollY > scrollThreshold && scrollY < hideThreshold

      setIsVisible(shouldShow)
    }, 100) // throttle로 성능 최적화

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 초기 상태 확인

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Button
        size="icon"
        onClick={handleClick}
        className="size-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="맨 위로 이동"
      >
        <ArrowUp className="size-5" />
      </Button>
    </div>
  )
})
