import { memo } from 'react'
import type { NavMenuItem } from '../type'

const NAV_ITEM_BUTTON_CLASS =
  'flex flex-col items-center gap-1 cursor-pointer transition-colors duration-150 focus-visible:outline-none'

interface NavMenuItemCompProps {
  item: NavMenuItem
  isActive: boolean
  isOpen: boolean
  onHover?: () => void
  onClick: () => void
}

export const NavMenuItemComp = memo<NavMenuItemCompProps>(({ item, isActive, isOpen, onHover, onClick }) => {
  const labelClassName = item.icon ? 'font-regular-12' : 'font-regular-16'
  const isHighlighted = isActive || isOpen

  return (
    <li>
      <button
        type="button"
        className={NAV_ITEM_BUTTON_CLASS}
        onMouseEnter={onHover}
        onFocus={onHover}
        onClick={onClick}
        style={{ color: isHighlighted ? 'var(--primary)' : 'var(--foreground)' }}
      >
        {item.icon}
        <span className={labelClassName}>{item.label}</span>
      </button>
    </li>
  )
})

NavMenuItemComp.displayName = 'NavMenuItemComp'
