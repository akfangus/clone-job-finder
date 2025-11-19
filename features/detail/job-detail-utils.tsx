import type { JSX } from 'react'

export function formatYearsRange(min: number | null, max: number | null): string {
  if (min === null && max === null) return '-'
  if (min !== null && max !== null) return `${min}~${max}년`
  if (min !== null) return `${min}년 이상`
  return `${max}년 이하`
}

export function renderListOrFallback(items: string[], fallback: string): JSX.Element {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500">{fallback}</p>
  }

  return (
    <ul className="list-disc space-y-1 pl-4 text-sm text-gray-700">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}


