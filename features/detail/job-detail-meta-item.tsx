import type { JSX } from 'react'

interface JobDetailMetaItemProps {
  label: string
  value: string
}

export function JobDetailMetaItem(props: JobDetailMetaItemProps): JSX.Element {
  const { label, value } = props

  return (
    <div className="flex flex-col">
      <span className="mb-0.5 text-[11px] font-medium text-gray-400">{label}</span>
      <span className="text-xs font-medium text-gray-800">{value}</span>
    </div>
  )
}
