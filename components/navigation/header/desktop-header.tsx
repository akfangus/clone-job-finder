'use client'

import { useCallback } from 'react'
import { NavMenu } from '../nav-menu'
import { DESKTOP_PRIMARY_NAV_ITEMS, DESKTOP_SECONDARY_NAV_ITEMS } from '../consts'
import { useRouter } from 'next/navigation'
import type { NavLinkItem, NavSubItem } from '../type'
import { useDisclosure } from '@/modules/hooks/use-disclosure'
import { LoginModal } from '@/components/login-modal'

export function DesktopHeader() {
  const router = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const openLoginModal = useCallback(() => {
    console.log('로그인 모달 열기')
    onOpen()
  }, [])

  const handleItemClick = useCallback((item: NavLinkItem | NavSubItem, parentId?: string): boolean => {
    // 로그인 아이템인 경우 커스텀 로직 실행 후 라우팅 방지
    if (item.id === 'login') {
      // 데스크톱 로그인 클릭 액션 처리
      openLoginModal()
      // 예: 로그인 페이지로 이동, 모달 열기 등
      return false
    }
    // 그 외는 기본 라우팅 수행
    return true
  }, [])

  return (
    <>
      <div className="flex gap-6 items-center">
        <button
          className="cursor-pointer"
          onClick={() => {
            router.push('/')
          }}
        >
          <p className="font-heading-20">GROUP BUY</p>
        </button>
        <NavMenu
          items={DESKTOP_PRIMARY_NAV_ITEMS}
          interactionMode="hover"
          onSelectItem={(item) => {
            console.log('select', item)
          }}
          onClick={handleItemClick}
        />
      </div>
      <NavMenu
        items={DESKTOP_SECONDARY_NAV_ITEMS}
        interactionMode="hover"
        onSelectItem={(item) => {
          console.log('select', item)
        }}
        onClick={handleItemClick}
      />
      {isOpen && <LoginModal isOpen={isOpen} onClose={onClose} />}
    </>
  )
}
