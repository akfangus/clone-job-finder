'use client'

import { Button } from '@/components/ui/button'
import { memo } from 'react'

export const MainIntro = memo(function MainIntro() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[600px] px-4 py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 size-72 rounded-full bg-blue-200 blur-3xl" />
        <div className="absolute bottom-20 right-10 size-96 rounded-full bg-purple-200 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl text-center">
        {/* 메인 타이틀 */}
        <h1 className="font-heading-32 md:font-heading-48 lg:font-heading-56 text-gray-900 animate-in fade-in-0 duration-700">
          검증된 스타트업에게
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            스카우트 제안
          </span>
          받으세요
        </h1>

        {/* 부제목 */}
        <p className="font-regular-18 md:font-regular-20 lg:font-regular-22 text-gray-600 max-w-2xl animate-in fade-in-0 duration-700 delay-150">
          VC가 투자한 성공 보장 스타트업에 합류해보세요.
          <br />
          매달 300명이 넘는 인재가 스카우트 제안을 받고 있어요.
        </p>

        {/* CTA 버튼 */}
        <div className="mt-4 animate-in fade-in-0 duration-700 delay-300">
          <Button size="lg" className="h-14 bg-emerald-400 hover:bg-emerald-300 font-bold-20">
            👉🏻 3초만에 가입하고 스카우트 제안받기
          </Button>
        </div>

        {/* 추가 정보 */}
        <p className="mt-8 font-regular-14 text-gray-500 animate-in fade-in duration-700 delay-500">
          아래 투자사에서 투자받은 스타트업에 지금 합류해보세요!
        </p>
      </div>
    </section>
  )
})
