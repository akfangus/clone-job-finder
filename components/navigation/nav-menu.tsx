'use client'

import { NavItem } from './type'
import { useMemo } from 'react'
import { NavItemComp } from './nav-item'
import { usePathname } from 'next/navigation'

interface NavMenuProps {
  items: NavItem[]
  onClick: (item: NavItem) => void
}

export function NavMenu({ items, onClick }: NavMenuProps) {
  const pathname = usePathname()

  const selectedItem = useMemo(() => {
    const navPathName = pathname.split('/')[1]
    const matchedNavItem = items.find((item) => item.url === navPathName)

    return matchedNavItem?.id || navPathName
  }, [items, pathname])
  return (
    <ul className="flex gap-8 items-center">
      {items.map((item) => (
        <NavItemComp key={item.id} item={item} isSelected={selectedItem === item.id} onClick={() => onClick(item)} />
      ))}
    </ul>
  )
}
