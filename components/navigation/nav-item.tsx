import { memo, useCallback } from 'react'
import { NavItem } from './type'

interface NavItemCompProps {
  item: NavItem
  isSelected: boolean
  onClick: () => void
}

export const NavItemComp = memo<NavItemCompProps>(({ item, isSelected, onClick }) => {
  const labelClassName = item.icon ? 'text-regular-12' : 'text-regular-16'
  return (
    <li
      className="flex flex-col gap-1 items-center cursor-pointer"
      onClick={onClick}
      style={{ color: isSelected ? 'var(--primary)' : 'var(--foreground)' }}
    >
      {item.icon}
      <span className={labelClassName}>{item.label}</span>
    </li>
  )
})

NavItemComp.displayName = 'NavItemComp'
