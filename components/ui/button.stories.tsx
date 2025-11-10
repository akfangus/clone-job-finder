import type { Meta, StoryObj } from '@storybook/react'
import keys from 'lodash/keys'
import { Loader2, MoveRight } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'

import { Button, buttonVariants } from './button'

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>

const VARIANT_MAP = {
  default: true,
  destructive: true,
  outline: true,
  secondary: true,
  ghost: true,
  link: true,
} satisfies Record<ButtonVariant, true>

const SIZE_MAP = {
  default: true,
  sm: true,
  lg: true,
  icon: true,
  'icon-sm': true,
  'icon-lg': true,
} satisfies Record<ButtonSize, true>

const variantOptions = keys(VARIANT_MAP) as ButtonVariant[]
const sizeOptions = keys(SIZE_MAP) as ButtonSize[]

const meta = {
  title: 'Components/UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'default',
    children: '버튼',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: variantOptions,
    },
    size: {
      control: { type: 'select' },
      options: sizeOptions,
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
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithIcon: Story = {
  args: {
    children: (
      <span className="inline-flex items-center gap-2">
        액션
        <MoveRight className="size-4" />
      </span>
    ),
  },
}

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <span className="inline-flex items-center gap-2">
        <Loader2 aria-hidden className="size-4 animate-spin" />
        처리 중
      </span>
    ),
  },
}

export const Variants: Story = {
  args: {
    children: 'Button',
  },
  argTypes: {
    variant: { control: false },
  },
  render: ({ children, size }) => (
    <div className="flex flex-wrap gap-3">
      {variantOptions.map((variant) => (
        <Button key={variant} size={size} variant={variant}>
          {children} · {variant}
        </Button>
      ))}
    </div>
  ),
}
