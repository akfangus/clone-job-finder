import { BookIcon, BriefcaseIcon, BuildingIcon, HeadsetIcon, LogInIcon, SearchIcon, UserIcon } from 'lucide-react'
import { NavMenu } from '../nav-menu'

export function DesktopHeader() {
  return (
    <>
      <div className="flex gap-6 items-center">
        <p className="text-heading-20">GROUP BUY</p>
        <NavMenu
          items={GUEST_NAV_ITEMS1}
          onClick={(item) => {
            console.log(item)
          }}
        />
      </div>
      <NavMenu
        items={GUEST_NAV_ITEMS2}
        onClick={(item) => {
          console.log(item)
        }}
      />
    </>
  )
}

const GUEST_NAV_ITEMS1 = [
  {
    id: 'suggestions',
    url: '/suggestions',
    // icon: <HeadsetIcon />,
    label: '제안받기  ',
  },
  {
    id: 'positions',
    url: '/positions',
    // icon: <BriefcaseIcon />,
    label: '채용공고',
  },
  {
    id: 'blog',
    url: '/blog',
    // icon: <BookIcon />,
    label: '블로그',
  },
]

const GUEST_NAV_ITEMS2 = [
  {
    id: 'search',
    url: '/search',
    icon: <SearchIcon />,
    // label: '제안받기  ',
  },
  {
    id: 'login',
    url: '/login',
    icon: <LogInIcon />,
    label: '로그인',
  },
  {
    id: 'business',
    url: '/business',
    icon: <BuildingIcon />,
    label: '기업 서비스',
  },
]
