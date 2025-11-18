import { JOB_CATEGORIES, JobCategoryFilter } from '../consts'

interface CategoryTabsProps {
  selected: JobCategoryFilter
  onSelect: (category: JobCategoryFilter) => void
}

export function CategoryTabs(props: CategoryTabsProps) {
  const { selected, onSelect } = props

  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1 text-xs">
      {JOB_CATEGORIES.map((category) => {
        const isActive = selected === category

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={[
              'rounded-full px-4 py-2 transition-colors',
              isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-200',
            ].join(' ')}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
