'use client'

import { useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { NavMenu } from '../nav-menu'
import { MOBILE_GUEST_NAV_ITEMS, MOBILE_USER_NAV_ITEMS } from '../consts'
import { useRouter } from 'next/navigation'
import type { NavLinkItem, NavSubItem } from '../type'
import { useDisclosure } from '@/modules/hooks/use-disclosure'
import { LoginModal } from '@/components/login-modal'

export function MobileHeader() {
  const user = false
  const router = useRouter()
  const navItems = user ? MOBILE_USER_NAV_ITEMS : MOBILE_GUEST_NAV_ITEMS

  const { isOpen, onOpen, onClose } = useDisclosure()

  const openLoginModal = useCallback(() => {
    console.log('로그인 모달 열기')
    onOpen()
  }, [])

  const handleItemClick = useCallback((item: NavLinkItem | NavSubItem, parentId?: string): boolean => {
    // 로그인 아이템인 경우 커스텀 로직 실행 후 라우팅 방지
    if (item.id === 'login') {
      // 로그인 클릭 액션 처리
      openLoginModal()
      // 예: 로그인 모달 열기, 로그인 페이지로 이동 등
      return false
    }
    // 그 외는 기본 라우팅 수행
    return true
  }, [])

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
      <NavMenu items={navItems} interactionMode="click" onClick={handleItemClick} />
      {isOpen && <LoginModal isOpen={isOpen} onClose={onClose} />}
    </>
  )
}
