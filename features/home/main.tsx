import { MainIntro } from './components/main-intro'
import { Investor } from './components/investor'
import { BannerIntro } from './components/banner-intro'
import { ProjectPlan } from './components/project-plan'
import { JoinStartup } from './components/join-startup'
import { BottomFloatButton } from './components/bottom-float-button'

export function HomeMain() {
  return (
    <main className="flex flex-col w-full">
      <MainIntro />
      <Investor />
      <BannerIntro />
      <ProjectPlan />
      <JoinStartup />
      <BottomFloatButton />
    </main>
  )
}
