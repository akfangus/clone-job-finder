import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/shared/lib/utils'

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  className?: string
}

const AvatarBase = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(function Avatar(
  { className, ...props },
  ref
): React.JSX.Element {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      data-slot="avatar"
      className={cn('flex overflow-hidden relative rounded-xl size-fit shrink-0', className)}
      {...props}
    />
  )
})

interface AvatarImageProps extends React.ComponentProps<typeof AvatarPrimitive.Image> {
  className?: string
}

const AvatarImageBase = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, AvatarImageProps>(
  function AvatarImage({ className, ...props }, ref): React.JSX.Element {
    return (
      <AvatarPrimitive.Image
        ref={ref}
        data-slot="avatar-image"
        className={cn('aspect-square size-full', className)}
        {...props}
      />
    )
  }
)

interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {
  className?: string
}

const AvatarFallbackBase = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, AvatarFallbackProps>(
  function AvatarFallback({ className, ...props }, ref): React.JSX.Element {
    return (
      <AvatarPrimitive.Fallback
        ref={ref}
        data-slot="avatar-fallback"
        className={cn('flex justify-center items-center rounded-full size-full bg-muted', className)}
        {...props}
      />
    )
  }
)

AvatarBase.displayName = AvatarPrimitive.Root.displayName ?? 'Avatar'
AvatarImageBase.displayName = AvatarPrimitive.Image.displayName ?? 'AvatarImage'
AvatarFallbackBase.displayName = AvatarPrimitive.Fallback.displayName ?? 'AvatarFallback'

const Avatar = React.memo(AvatarBase)
const AvatarImage = React.memo(AvatarImageBase)
const AvatarFallback = React.memo(AvatarFallbackBase)

Avatar.displayName = AvatarBase.displayName
AvatarImage.displayName = AvatarImageBase.displayName
AvatarFallback.displayName = AvatarFallbackBase.displayName

export { Avatar, AvatarFallback, AvatarImage }
