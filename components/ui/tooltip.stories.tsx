import type { Meta, StoryObj } from '@storybook/react'

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { Button } from './button'

type TooltipSide = 'top' | 'right' | 'bottom' | 'left'

const meta = {
  title: 'Components/UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: { type: 'inline-radio' },
      options: ['top', 'right', 'bottom', 'left'],
    },
  } as unknown as Meta<typeof Tooltip>['argTypes'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<{ side: TooltipSide }>

export const Playground: Story = {
  args: {
    side: 'top' satisfies TooltipSide,
  },
  render: ({ side }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="sm" variant="secondary">
          정보
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>툴팁 설명이 여기에 표시됩니다.</TooltipContent>
    </Tooltip>
  ),
}

export const WithCustomDelay: Story = {
  args: {
    side: 'bottom' satisfies TooltipSide,
  },
  render: ({ side }) => (
    <Tooltip delayDuration={400}>
      <TooltipTrigger asChild>
        <Button>커스텀 딜레이</Button>
      </TooltipTrigger>
      <TooltipContent className="text-sm" side={side}>
        400ms 후에 표시되는 툴팁입니다.
      </TooltipContent>
    </Tooltip>
  ),
}

export const IconOnly: Story = {
  args: {
    side: 'right' satisfies TooltipSide,
  },
  render: ({ side }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label="도움말"
          className="inline-flex justify-center items-center text-lg font-medium rounded-full border size-10 border-border hover:bg-muted"
          type="button"
        >
          ?
        </button>
      </TooltipTrigger>
      <TooltipContent side={side}>아이콘-only 버튼에도 쉽게 사용할 수 있어요.</TooltipContent>
    </Tooltip>
  ),
}

export const Persistent: Story = {
  args: {
    side: 'bottom' satisfies TooltipSide,
  },
  render: ({ side }) => (
    <Tooltip open>
      <TooltipTrigger asChild>
        <Button variant="outline">항상 열림</Button>
      </TooltipTrigger>
      <TooltipContent className="text-sm" side={side}>
        이 툴팁은 항상 열린 상태로 표시됩니다.
      </TooltipContent>
    </Tooltip>
  ),
}
