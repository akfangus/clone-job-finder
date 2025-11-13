import { memo } from 'react'
import type { NavLinkItem } from '../type'

const NAV_ITEM_BUTTON_CLASS =
  'flex flex-col items-center gap-1 cursor-pointer transition-colors duration-150 focus-visible:outline-none'

interface NavLinkItemCompProps {
  item: NavLinkItem
  isActive: boolean
  onHover?: () => void
  onClick: () => void
}

export const NavLinkItemComp = memo<NavLinkItemCompProps>(({ item, isActive, onHover, onClick }) => {
  const labelClassName = item.icon ? 'font-regular-12' : 'font-regular-16'

  return (
    <li>
      <button
        type="button"
        className={NAV_ITEM_BUTTON_CLASS}
        onMouseEnter={onHover}
        onFocus={onHover}
        onClick={onClick}
        style={{ color: isActive ? 'var(--primary)' : 'var(--foreground)' }}
      >
        {item.icon}
        <span className={labelClassName}>{item.label}</span>
      </button>
    </li>
  )
})

NavLinkItemComp.displayName = 'NavLinkItemComp'

