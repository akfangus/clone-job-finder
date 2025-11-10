import type { Meta, StoryObj } from '@storybook/react'
import keys from 'lodash/keys'
import { Hash } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'

import { Tag, tagVariants } from './tag'

type TagVariant = NonNullable<VariantProps<typeof tagVariants>['variant']>
type TagSize = NonNullable<VariantProps<typeof tagVariants>['size']>

const VARIANT_MAP = {
  default: true,
  neutral: true,
  outline: true,
  surface: true,
} satisfies Record<TagVariant, true>

const SIZE_MAP = {
  sm: true,
  md: true,
  lg: true,
} satisfies Record<TagSize, true>

const variantOptions = keys(VARIANT_MAP) as TagVariant[]
const sizeOptions = keys(SIZE_MAP) as TagSize[]

const meta = {
  title: 'Components/UI/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'md',
    children: '#글로벌',
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
  },
} satisfies Meta<typeof Tag>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithIcon: Story = {
  args: {
    children: (
      <span className="inline-flex items-center gap-1.5">
        <Hash aria-hidden className="size-3" />
        글로벌
      </span>
    ),
  },
}

export const Variants: Story = {
  argTypes: {
    variant: { control: false },
  },
  render: ({ size }) => (
    <div className="flex flex-wrap items-start gap-3">
      {variantOptions.map((variant) => (
        <Tag key={variant} size={size} variant={variant}>
          #{variant}
        </Tag>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  argTypes: {
    size: { control: false },
  },
  render: ({ variant }) => (
    <div className="flex flex-wrap items-start gap-3">
      {sizeOptions.map((size) => (
        <Tag key={size} size={size} variant={variant}>
          #{size}
        </Tag>
      ))}
    </div>
  ),
}

export const AsLink: Story = {
  render: (args) => (
    <Tag {...args} asChild>
      <a className="no-underline text-inherit transition-colors hover:text-inherit" href="#tag">
        링크 태그
      </a>
    </Tag>
  ),
}

