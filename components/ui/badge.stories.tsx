import type { Meta, StoryObj } from '@storybook/react'
import keys from 'lodash/keys'
import { Check } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'

import { Badge, badgeVariants } from './badge'

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

const VARIANT_MAP = {
  default: true,
  secondary: true,
  destructive: true,
  outline: true,
} satisfies Record<BadgeVariant, true>

const variantOptions = keys(VARIANT_MAP) as BadgeVariant[]

const meta = {
  title: 'Components/UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    children: '배지',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: variantOptions,
    },
    asChild: {
      control: false,
      table: { disable: true },
    },
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
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithIcon: Story = {
  args: {
    children: (
      <span className="inline-flex items-center gap-1.5">
        완료
        <Check aria-hidden className="size-3.5" />
      </span>
    ),
  },
}

export const Variants: Story = {
  argTypes: {
    variant: { control: false },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-3">
      {variantOptions.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
}

export const AsLink: Story = {
  render: (args) => (
    <Badge {...args} asChild>
      <a className="no-underline text-inherit transition-colors hover:text-inherit" href="#badge">
        링크 배지
      </a>
    </Badge>
  ),
}
