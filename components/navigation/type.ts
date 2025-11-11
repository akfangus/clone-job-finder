import { ReactNode } from 'react'

export interface NavSubItem {
  id: string
  label: string
  url: string
  icon?: ReactNode
}

export interface NavLinkItem {
  type: 'link'
  id: string
  label?: string
  url: string
  icon?: ReactNode
}

export interface NavMenuItem {
  type: 'menu'
  id: string
  label?: string
  icon?: ReactNode
  items: NavSubItem[]
}

export type NavItem = NavLinkItem | NavMenuItem
