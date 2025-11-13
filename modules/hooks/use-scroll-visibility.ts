'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface UseScrollVisibilityOptions {
  topThreshold?: number
  bottomThreshold?: number
}

interface UseScrollVisibilityResult {
  isVisible: boolean
}

export function useScrollVisibility({
  topThreshold = 500,
  bottomThreshold = 500,
}: UseScrollVisibilityOptions = {}): UseScrollVisibilityResult {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const frameIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    function checkVisibility(): void {
      const scrollY = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight

      const isPastTopThreshold = scrollY >= topThreshold
      const distanceToBottom = scrollHeight - scrollY - windowHeight
      const isBeforeBottomThreshold = distanceToBottom >= bottomThreshold

      const shouldBeVisible = isPastTopThreshold && isBeforeBottomThreshold

      setIsVisible(shouldBeVisible)
      frameIdRef.current = null
    }

    function handleScroll(): void {
      if (frameIdRef.current !== null) {
        return
      }

      frameIdRef.current = requestAnimationFrame(checkVisibility)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    frameIdRef.current = requestAnimationFrame(checkVisibility)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current)
        frameIdRef.current = null
      }
    }
  }, [topThreshold, bottomThreshold])

  return useMemo<UseScrollVisibilityResult>(
    () => ({
      isVisible,
    }),
    [isVisible],
  )
}

