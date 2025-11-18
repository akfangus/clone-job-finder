import type { Meta, StoryObj } from '@storybook/react'

import { Spinner } from './spinner'

const meta = {
  title: 'Components/UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {
    size: 'md',
    text: '로딩 중입니다...',
  },
  argTypes: {
    className: {
      control: false,
      table: { disable: true },
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithoutText: Story = {
  args: {
    text: undefined,
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    text: '큰 스피너 로딩 중...',
  },
}


