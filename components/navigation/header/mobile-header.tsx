'use client'

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { NavMenu } from '../nav-menu'
import { MOBILE_GUEST_NAV_ITEMS, MOBILE_USER_NAV_ITEMS } from '../consts'
import { useRouter } from 'next/navigation'

export function MobileHeader() {
  const user = false
  const navItems = user ? USER_NAV_ITEMS : GUEST_NAV_ITEMS

  const router = useRouter()

  return (
    <>
      <div className="flex gap-2 items-center">
        <Avatar className="size-[60px] cursor-pointer" onClick={() => router.push('/')}>
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
        interactionMode="click"
        onSelectItem={(item) => {
          console.log('select', item)
        }}
        onNavigate={({ item, parentId }) => {
          console.log('navigate', item, parentId)
        }}
      />
    </>
  )
}

const GUEST_NAV_ITEMS = MOBILE_GUEST_NAV_ITEMS
const USER_NAV_ITEMS = MOBILE_USER_NAV_ITEMS
