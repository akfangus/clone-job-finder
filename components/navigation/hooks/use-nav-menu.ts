import find from 'lodash/find'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import type { NavItem, NavLinkItem, NavMenuItem, NavSubItem } from '../type'

interface UseNavInteractionParams {
  items: NavItem[]
  onNavigate?: (payload: { item: NavLinkItem | NavSubItem; parentId?: string }) => void
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
  onNavigate,
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
        item.type === 'menu' &&
        Boolean(find(item.items, (subItem) => normalizePath(subItem.url) === currentSegment))
    ) as NavMenuItem | undefined

    return matchedMenu ? matchedMenu.id : null
  }, [items, pathname])

  const handleNavigate = useCallback(
    (target: NavLinkItem | NavSubItem, parentId?: string) => {
      const targetUrl = target.url.startsWith('/') ? target.url : `/${target.url}`
      router.push(targetUrl)
      onNavigate?.({ item: target, parentId })
    },
    [onNavigate, router]
  )

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
        handleNavigate(item)
        return
      }

      if (interactionMode === 'click') {
        setHoveredMenu((prev) => (prev?.id === item.id ? null : item))
        return
      }

      setHoveredMenu(item)
    },
    [handleNavigate, interactionMode]
  )

  const handleSubItemClick = useCallback(
    (parentId: string, subItem: NavSubItem) => {
      handleNavigate(subItem, parentId)
      setHoveredMenu(null)
    },
    [handleNavigate]
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

