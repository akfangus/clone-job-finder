import * as React from 'react'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from './dialog'
import { cn } from '@/shared/lib/utils'

interface PortalProps
  extends Pick<React.ComponentProps<typeof Dialog>, 'open' | 'defaultOpen' | 'onOpenChange' | 'modal'> {
  trigger?: React.ReactNode
  header?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

const Portal = React.memo(function Portal({
  trigger,
  header,
  content,
  footer,
  className,
  showCloseButton = true,
  open,
  defaultOpen,
  onOpenChange,
  modal,
}: PortalProps): React.ReactElement {
  return (
    <Dialog defaultOpen={defaultOpen} modal={modal} onOpenChange={onOpenChange} open={open}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        className={cn(
          'w-full max-w-[min(1060px,calc(100vw-2rem))] gap-0 rounded-xl px-4 py-5 sm:max-w-[min(1060px,calc(100vw-2rem))]! sm:px-6 sm:py-6 md:max-w-[min(1060px,calc(100vw-2rem))]! lg:max-w-[min(1060px,calc(100vw-2rem))]! xl:max-w-[min(1060px,calc(100vw-2rem))]! 2xl:max-w-[min(1060px,calc(100vw-2rem))]!',
          className
        )}
        showCloseButton={showCloseButton}
      >
        <div className="flex flex-col gap-5">
          {header ? <DialogHeader className="gap-2 text-left">{header}</DialogHeader> : null}
          {content ? <div className="text-sm text-muted-foreground">{content}</div> : null}
          {footer ? <DialogFooter className="gap-3 justify-start sm:justify-end">{footer}</DialogFooter> : null}
        </div>
      </DialogContent>
    </Dialog>
  )
})

Portal.displayName = 'Portal'

export { Portal }
