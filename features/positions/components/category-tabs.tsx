import { JOB_CATEGORY_CONFIG, JobCategoryFilter } from '../consts'

interface CategoryTabsProps {
  selected: JobCategoryFilter
  onSelect: (category: JobCategoryFilter) => void
}

export function CategoryTabs(props: CategoryTabsProps) {
  const { selected, onSelect } = props

  return (
    <div className="inline-flex rounded-md  p-1 text-xs">
      {JOB_CATEGORY_CONFIG.map((category) => {
        const isActive = selected === category.id

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={[
              'rounded-full px-4 py-2 transition-colors cursor-pointer',
              isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-200',
            ].join(' ')}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
