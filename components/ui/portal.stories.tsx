import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Portal } from './portal'
import { Button } from './button'

const meta = {
  title: 'Components/UI/Portal',
  component: Portal,
  tags: ['autodocs'],
  args: {
    trigger: <Button>포털 열기</Button>,
    header: (
      <>
        <h3 className="text-xl font-semibold text-foreground">알림 설정</h3>
        <p className="text-sm text-muted-foreground">관심 카테고리 알림을 받아보세요.</p>
      </>
    ),
    content: (
      <div className="flex flex-col gap-3 text-foreground">
        <p>새로운 요청이 등록되면 즉시 알려드릴게요.</p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>관심 카테고리를 여러 개 선택할 수 있어요.</li>
          <li>언제든 설정에서 알림을 끌 수 있습니다.</li>
        </ul>
      </div>
    ),
    footer: (
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary">나중에 하기</Button>
        <Button>알림 받기</Button>
      </div>
    ),
    defaultOpen: false,
    showCloseButton: true,
  },
  argTypes: {
    trigger: { control: false },
    header: { control: false },
    content: { control: false },
    footer: { control: false },
    showCloseButton: { control: { type: 'boolean' } },
    onOpenChange: { action: 'open-change' },
    open: { control: false },
    defaultOpen: { control: { type: 'boolean' } },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Portal>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithoutFooter: Story = {
  args: {
    footer: null,
  },
}

export const WithInlineTrigger: Story = {
  args: {
    trigger: (
      <Button variant="outline" className="rounded-lg border-dashed">
        옵션 보기
      </Button>
    ),
    header: (
      <>
        <h3 className="text-xl font-semibold text-foreground">서비스 옵션</h3>
        <p className="text-sm text-muted-foreground">필요한 옵션을 선택해 주세요.</p>
      </>
    ),
    content: (
      <div className="flex flex-col gap-4 text-foreground">
        <label className="flex items-center gap-3 text-sm">
          <input className="size-4 rounded border-border" defaultChecked type="checkbox" />
          프리미엄 케어 추가
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input className="size-4 rounded border-border" type="checkbox" />
          방문 서비스 요청
        </label>
      </div>
    ),
    footer: (
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary">취소</Button>
        <Button>적용</Button>
      </div>
    ),
  },
}

export const AlwaysOpen: Story = {
  args: {
    open: true,
    trigger: null,
  },
  render: (args) => {
    const [open, setOpen] = React.useState(args.open)

    return (
      <Portal
        {...args}
        onOpenChange={setOpen}
        open={open}
        trigger={
          <Button onClick={() => setOpen(true)} variant="secondary">
            열기
          </Button>
        }
      />
    )
  },
}

