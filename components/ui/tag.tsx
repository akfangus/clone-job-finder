import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const tagVariants = cva(
  'inline-flex items-center justify-center rounded-lg border font-medium leading-none tracking-tight text-foreground transition-[color,background-color,border-color] select-none whitespace-nowrap gap-1.5 w-fit rounded-md text-gray-600',
  {
    variants: {
      variant: {
        default: 'bg-emerald-100/90  border-transparent ',
        neutral: 'bg-muted ',
        outline: 'bg-transparent border-foreground/20 ',
        surface: 'bg-foreground/10 ',
      },
      size: {
        sm: 'px-2 py-.5 text-xs',
        md: 'px-3 py-.5 text-sm',
        lg: 'px-4 py-1 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface TagProps extends React.ComponentProps<'span'>, VariantProps<typeof tagVariants> {
  asChild?: boolean
}

const Tag = React.memo(function Tag({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: TagProps): React.ReactElement {
  const Comp = asChild ? Slot : 'span'

  return <Comp data-slot="tag" className={cn(tagVariants({ variant, size }), className)} {...props} />
})

Tag.displayName = 'Tag'

export { Tag, tagVariants }
