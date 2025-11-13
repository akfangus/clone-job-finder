'use client'

import { useCallback } from 'react'
import { NavMenu } from '../nav-menu'
import { DESKTOP_PRIMARY_NAV_ITEMS, DESKTOP_SECONDARY_NAV_ITEMS } from '../consts'
import { useRouter } from 'next/navigation'
import type { NavLinkItem, NavSubItem } from '../type'
import { useDisclosure } from '@/modules/hooks/use-disclosure'
import { LoginModal } from '@/components/login-modal'
import { useAuthStore } from '@/modules/stores'
import { useLogoutMutation } from '@/modules/queries/auth'

export function DesktopHeader() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const logoutMutation = useLogoutMutation()

  const openLoginModal = useCallback(() => {
    onOpen()
  }, [onOpen])

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [logoutMutation])

  const handleItemClick = useCallback(
    (item: NavLinkItem | NavSubItem): boolean => {
      // 로그인 아이템인 경우 커스텀 로직 실행 후 라우팅 방지
      if (item.id === 'login') {
        openLoginModal()
        return false
      }

      // 로그아웃 아이템인 경우 로그아웃 처리
      if (item.id === 'logout') {
        handleLogout()
        return false
      }

      // 그 외는 기본 라우팅 수행
      return true
    },
    [openLoginModal, handleLogout]
  )

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
        items={
          isAuthenticated
            ? DESKTOP_SECONDARY_NAV_ITEMS.filter((item) => item.id !== 'login')
            : DESKTOP_SECONDARY_NAV_ITEMS
        }
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
