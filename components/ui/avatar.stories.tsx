import type { Meta, StoryObj } from '@storybook/react'
import map from 'lodash/map'

import { Avatar, AvatarFallback, AvatarImage } from './avatar'

const meta = {
  title: 'Components/UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    className: undefined,
  },
  argTypes: {
    className: {
      control: false,
      table: { disable: true },
    },
  },
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#020817' },
      ],
    },
  },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

const GROUP_MEMBERS = [
  {
    id: 'shadcn',
    initials: 'CN',
    alt: '@shadcn',
    src: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80&fm=webp',
  },
  {
    id: 'maxleiter',
    initials: 'ML',
    alt: '@maxleiter',
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80&fm=webp',
  },
  {
    id: 'evilrabbit',
    initials: 'ER',
    alt: '@evilrabbit',
    src: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&facepad=3&w=128&h=128&q=80&fm=webp',
  },
] as const

export const Playground: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage
        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=3&w=128&h=128&q=80&fm=webp"
        alt="사용자 아바타"
        width={128}
        height={128}
        loading="lazy"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
}

export const InitialFallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="" alt="이미지 준비 중" />
      <AvatarFallback>NA</AvatarFallback>
    </Avatar>
  ),
}

export const GroupStack: Story = {
  render: (args) => (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-10 *:data-[slot=avatar]:ring-2">
      {map(GROUP_MEMBERS, (member) => (
        <Avatar key={member.id} {...args}>
          <AvatarImage src={member.src} alt={member.alt} width={128} height={128} loading="lazy" />
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}
