import { cn } from '@/shared/lib/utils'

type Props = React.PropsWithChildren & {
  className?: string
}

export function FloatingBG({ className, children }: Props) {
  return (
    <div
      style={{
        background: 'transparent',
      }}
      className={cn('p-4 h-[calc(5.5rem+var(--safe-bottom))] pb-[calc(var(--safe-bottom)+1rem)]', className)}
    >
      {children}
    </div>
  )
}
