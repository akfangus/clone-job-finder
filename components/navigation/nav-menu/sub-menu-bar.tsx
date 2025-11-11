'use client'

import type { NavMenuItem, NavSubItem } from '../type'

interface SubMenuBarProps {
  menu: NavMenuItem | null
  onItemClick: (subItem: NavSubItem) => void
}

export function SubMenuBar({ menu, onItemClick }: SubMenuBarProps) {
  if (!menu) return null

  return (
    <div className="absolute left-0 top-full z-20 w-full bg-white border shadow-lg border-slate-200">
      <ul className="flex flex-col gap-6 py-3">
        {menu.items.map((subItem) => (
          <li key={subItem.id}>
            <button
              type="button"
              className="w-full transition-colors duration-150 cursor-pointer text-regular-14 text-slate-700 hover:text-primary focus-visible:outline-none"
              onClick={() => onItemClick(subItem)}
            >
              {subItem.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
