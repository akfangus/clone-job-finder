'use client'

import { BriefcaseIcon, LogInIcon, MessageCircleIcon, MoreHorizontalIcon, UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { NavMenu } from '../nav-menu'

export function MobileHeader() {
  const user = false
  const navItems = user ? USER_NAV_ITEMS : GUEST_NAV_ITEMS

  return (
    <>
      <div className="flex gap-2 items-center">
        <Avatar className="size-[60px]">
          <AvatarImage
            src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80&fm=webp"
            alt="@shadcn"
            width={128}
            height={128}
            loading="lazy"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <NavMenu
        items={navItems}
        onClick={(item) => {
          console.log(item)
        }}
      />
    </>
  )
}

const GUEST_NAV_ITEMS = [
  {
    id: 'positions',
    url: '/positions',
    icon: <BriefcaseIcon />,
    label: '채용공고',
  },
  {
    id: 'login',
    url: '/login',
    icon: <LogInIcon />,
    label: '로그인',
  },
  {
    id: 'more',
    url: '/more',
    icon: <MoreHorizontalIcon />,
    label: '더보기',
  },
]

const USER_NAV_ITEMS = [
  {
    id: 'positions',
    url: '/positions',
    icon: <BriefcaseIcon />,
    label: '채용공고',
  },
  {
    id: 'chat-rooms',
    url: '/chat-rooms',
    icon: <MessageCircleIcon />,
    label: '채팅',
  },
  {
    id: 'my-page',
    url: '/my-page',
    icon: <UserIcon />,
    label: 'MY',
  },
  {
    id: 'more',
    url: '/more',
    icon: <MoreHorizontalIcon />,
    label: '더보기',
  },
]
