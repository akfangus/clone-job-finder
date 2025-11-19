import type { JSX } from 'react'

interface JobDetailSectionProps {
  title: string
  children: React.ReactNode
}

export function JobDetailSection(props: JobDetailSectionProps): JSX.Element {
  const { title, children } = props

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  )
}
