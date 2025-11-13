'use client'

import { useCallback, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { NavMenu } from '../nav-menu'
import { MOBILE_GUEST_NAV_ITEMS, MOBILE_USER_NAV_ITEMS } from '../consts'
import { useRouter } from 'next/navigation'
import type { NavLinkItem, NavSubItem } from '../type'
import { useDisclosure } from '@/modules/hooks/use-disclosure'
import { LoginModal } from '@/components/login-modal'
import { useAuthStore } from '@/modules/stores'
import { useLogoutMutation } from '@/modules/queries/auth'

export function MobileHeader() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const logoutMutation = useLogoutMutation()

  const navItems = useMemo(() => {
    return isAuthenticated ? MOBILE_USER_NAV_ITEMS : MOBILE_GUEST_NAV_ITEMS
  }, [isAuthenticated])

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

  const userInitials = useMemo(() => {
    if (!user?.email) return 'CN'
    return user.email.substring(0, 2).toUpperCase()
  }, [user])

  return (
    <>
      <div className="flex gap-2 items-center">
        <Avatar className="size-[60px] cursor-pointer" onClick={() => router.push('/')}>
          <AvatarImage
            src={user?.user_metadata?.avatar_url}
            alt={user?.email || 'User'}
            width={128}
            height={128}
            loading="lazy"
          />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </div>
      <NavMenu items={navItems} interactionMode="click" onClick={handleItemClick} />
      {isOpen && <LoginModal isOpen={isOpen} onClose={onClose} />}
    </>
  )
}
