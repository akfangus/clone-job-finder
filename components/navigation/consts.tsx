import {
  BookIcon,
  BriefcaseIcon,
  BuildingIcon,
  HeadsetIcon,
  LogInIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  SearchIcon,
  UserIcon,
} from 'lucide-react'
import type { NavItem, NavMenuItem } from './type'

export const DESKTOP_SUGGESTION_MENU_ITEMS: NavMenuItem['items'] = [
  { id: 'suggestions-main', label: '전체 서비스', url: '/suggestions' },
  { id: 'suggestions-design', label: '디자인', url: '/suggestions/design' },
  { id: 'suggestions-it', label: 'IT · 프로그래밍', url: '/suggestions/it' },
]

export const DESKTOP_BUSINESS_MENU_ITEMS: NavMenuItem['items'] = [
  { id: 'business-overview', label: '기업 소개', url: '/business' },
  { id: 'business-success', label: '성공 사례', url: '/business/success' },
]

export const DESKTOP_PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    type: 'menu',
    id: 'suggestions',
    label: '제안받기',
    icon: <HeadsetIcon size={16} />,
    items: DESKTOP_SUGGESTION_MENU_ITEMS,
  },
  {
    type: 'link',
    id: 'positions',
    url: '/positions',
    icon: <BriefcaseIcon size={16} />,
    label: '채용공고',
  },
  {
    type: 'link',
    id: 'blog',
    url: '/blog',
    icon: <BookIcon size={16} />,
    label: '블로그',
  },
]

export const DESKTOP_SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    type: 'link',
    id: 'search',
    url: '/search',
    icon: <SearchIcon size={18} />,
  },
  {
    type: 'link',
    id: 'login',
    url: '/login',
    icon: <LogInIcon size={18} />,
    label: '로그인',
  },
  {
    type: 'menu',
    id: 'business',
    icon: <BuildingIcon size={18} />,
    label: '기업 서비스',
    items: DESKTOP_BUSINESS_MENU_ITEMS,
  },
]

export const MOBILE_MORE_MENU_ITEMS: NavMenuItem['items'] = [
  { id: 'settings', label: '설정', url: '/settings' },
  { id: 'support', label: '고객센터', url: '/support' },
  { id: 'logout', label: '로그아웃', url: '/logout' },
]

export const MOBILE_GUEST_NAV_ITEMS: NavItem[] = [
  {
    type: 'link',
    id: 'positions',
    url: '/positions',
    icon: <BriefcaseIcon size={18} />,
    label: '채용공고',
  },
  {
    type: 'link',
    id: 'login',
    url: '/login',
    icon: <LogInIcon size={18} />,
    label: '로그인',
  },
  {
    type: 'menu',
    id: 'more',
    icon: <MoreHorizontalIcon size={18} />,
    label: '더보기',
    items: MOBILE_MORE_MENU_ITEMS,
  },
]

export const MOBILE_USER_NAV_ITEMS: NavItem[] = [
  {
    type: 'link',
    id: 'positions',
    url: '/positions',
    icon: <BriefcaseIcon size={18} />,
    label: '채용공고',
  },
  {
    type: 'link',
    id: 'chat-rooms',
    url: '/chat-rooms',
    icon: <MessageCircleIcon size={18} />,
    label: '채팅',
  },
  {
    type: 'link',
    id: 'my-page',
    url: '/my-page',
    icon: <UserIcon size={18} />,
    label: 'MY',
  },
  {
    type: 'menu',
    id: 'more',
    icon: <MoreHorizontalIcon size={18} />,
    label: '더보기',
    items: MOBILE_MORE_MENU_ITEMS,
  },
]
