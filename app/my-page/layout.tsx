export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full flex-col bg-amber-100/50 items-center justify-center">{children}</div>
}
