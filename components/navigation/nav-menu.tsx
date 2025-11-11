'use client'

import { useCallback } from 'react'
import { NavLinkItemComp, NavMenuItemComp } from './nav-item'
import { SubMenuBar } from './nav-menu/sub-menu-bar'
import type { NavItem, NavLinkItem, NavSubItem } from './type'
import { useNavInteraction } from './hooks/use-nav-menu'

interface NavMenuProps {
  items: NavItem[]
  onSelectItem?: (item: NavItem) => void
  onNavigate?: (payload: { item: NavLinkItem | NavSubItem; parentId?: string }) => void
  interactionMode?: 'hover' | 'click'
}

export function NavMenu({ items, onSelectItem, onNavigate, interactionMode = 'hover' }: NavMenuProps) {
  const { activeItemId, hoveredMenu, handleItemHover, handleItemClick, handleSubItemClick, resetHover } =
    useNavInteraction({
      items,
      onNavigate,
      interactionMode,
    })

  const handleMouseLeave = useCallback(() => {
    resetHover()
  }, [resetHover])

  const shouldHandleHover = interactionMode === 'hover'

  return (
    <nav className="relative" onMouseLeave={shouldHandleHover ? handleMouseLeave : undefined}>
      <ul className="flex gap-8 items-center">
        {items.map((item) =>
          item.type === 'link' ? (
            <NavLinkItemComp
              key={item.id}
              item={item}
              isActive={activeItemId === item.id}
              onHover={shouldHandleHover ? () => handleItemHover(item) : undefined}
              onClick={() => {
                onSelectItem?.(item)
                handleItemClick(item)
              }}
            />
          ) : (
            <NavMenuItemComp
              key={item.id}
              item={item}
              isActive={activeItemId === item.id}
              isOpen={hoveredMenu?.id === item.id}
              onHover={shouldHandleHover ? () => handleItemHover(item) : undefined}
              onClick={() => {
                onSelectItem?.(item)
                handleItemClick(item)
              }}
            />
          )
        )}
      </ul>
      <SubMenuBar
        menu={hoveredMenu}
        onItemClick={(subItem) => {
          if (!hoveredMenu) return
          handleSubItemClick(hoveredMenu.id, subItem)
        }}
      />
    </nav>
  )
}
