import find from 'lodash/find'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import type { NavItem, NavLinkItem, NavMenuItem, NavSubItem } from '../type'

interface UseNavInteractionParams {
  items: NavItem[]
  onClick?: (item: NavLinkItem | NavSubItem, parentId?: string) => boolean | void
  interactionMode?: 'hover' | 'click'
}

interface UseNavInteractionResult {
  activeItemId: string | null
  hoveredMenu: NavMenuItem | null
  handleItemHover: (item: NavItem | null) => void
  handleItemClick: (item: NavItem) => void
  handleSubItemClick: (parentId: string, subItem: NavSubItem) => void
  resetHover: () => void
}

function normalizePath(path: string): string {
  if (!path) return ''
  const normalized = path.startsWith('/') ? path : `/${path}`
  const segments = normalized.split('/').filter(Boolean)
  return segments.length > 0 ? segments[0] : ''
}

function getHoveredMenu(item: NavItem | null): NavMenuItem | null {
  if (!item) return null
  return item.type === 'menu' ? item : null
}

export function useNavInteraction({
  items,
  onClick,
  interactionMode = 'hover',
}: UseNavInteractionParams): UseNavInteractionResult {
  const router = useRouter()
  const pathname = usePathname()
  const [hoveredMenu, setHoveredMenu] = useState<NavMenuItem | null>(null)

  const activeItemId = useMemo(() => {
    const currentSegment = normalizePath(pathname)
    if (!currentSegment) return null

    const matchedLink = find(items, (item) => item.type === 'link' && normalizePath(item.url) === currentSegment) as
      | NavLinkItem
      | undefined

    if (matchedLink) return matchedLink.id

    const matchedMenu = find(
      items,
      (item) =>
        item.type === 'menu' && Boolean(find(item.items, (subItem) => normalizePath(subItem.url) === currentSegment))
    ) as NavMenuItem | undefined

    return matchedMenu ? matchedMenu.id : null
  }, [items, pathname])

  const handleItemHover = useCallback(
    (item: NavItem | null) => {
      if (interactionMode !== 'hover') return
      setHoveredMenu(getHoveredMenu(item))
    },
    [interactionMode]
  )

  const handleItemClick = useCallback(
    (item: NavItem) => {
      if (item.type === 'link') {
        // onClick이 있으면 먼저 호출
        const shouldNavigate = onClick?.(item)

        // onClick이 false를 반환하면 라우팅 방지
        if (shouldNavigate === false) {
          return
        }

        // onClick이 없거나 true/undefined를 반환하면 기본 라우팅 수행
        const targetUrl = item.url.startsWith('/') ? item.url : `/${item.url}`
        router.push(targetUrl)
        return
      }

      if (interactionMode === 'click') {
        setHoveredMenu((prev) => (prev?.id === item.id ? null : item))
        return
      }

      setHoveredMenu(item)
    },
    [onClick, router, interactionMode]
  )

  const handleSubItemClick = useCallback(
    (parentId: string, subItem: NavSubItem) => {
      // onClick이 있으면 먼저 호출
      const shouldNavigate = onClick?.(subItem, parentId)

      // onClick이 false를 반환하면 라우팅 방지
      if (shouldNavigate === false) {
        setHoveredMenu(null)
        return
      }

      // onClick이 없거나 true/undefined를 반환하면 기본 라우팅 수행
      const targetUrl = subItem.url.startsWith('/') ? subItem.url : `/${subItem.url}`
      router.push(targetUrl)
      setHoveredMenu(null)
    },
    [onClick, router]
  )

  const resetHover = useCallback(() => {
    if (interactionMode !== 'hover') return
    setHoveredMenu(null)
  }, [interactionMode])

  return {
    activeItemId,
    hoveredMenu,
    handleItemHover,
    handleItemClick,
    handleSubItemClick,
    resetHover,
  }
}
