import { cn } from '@/shared/lib/utils'

interface FloatingBGProps extends React.PropsWithChildren {
  className?: string
  style?: React.CSSProperties
}

export function FloatingBG({ className, children, style }: FloatingBGProps) {
  return (
    <div
      style={{
        background: 'transparent',
        ...style,
      }}
      className={cn('p-4 h-[calc(5.5rem+var(--safe-bottom))] pb-[calc(var(--safe-bottom)+1rem)]', className)}
    >
      {children}
    </div>
  )
}
