import { Button } from '@/components/ui/button'
import { FloatingBG } from '@/components/ui/floating-bg'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function BottomFloatButton() {
  return (
    <FloatingBG className="fixed right-0 bottom-8 left-0 max-w-180 justify-self-center">
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button size="lg" className="h-14 bg-emerald-400 hover:bg-emerald-300 font-bold-20 text-white">
            👉🏻 3초만에 가입하고 스카우트 제안받기
          </Button>
        </TooltipTrigger>
        <TooltipContent className="rounded-4xl animate-gentle-bounce">
          <p className="font-regular-14 text-emerald-400 ">희망 구직 조건을 등록하고, 딱 맞는 제안만 받아보세요!</p>
        </TooltipContent>
      </Tooltip>
    </FloatingBG>
  )
}
