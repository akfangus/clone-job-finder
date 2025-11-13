import { NavMenu } from '../nav-menu'
import { DESKTOP_PRIMARY_NAV_ITEMS, DESKTOP_SECONDARY_NAV_ITEMS } from '../consts'
import { useRouter } from 'next/navigation'

export function DesktopHeader() {
  const router = useRouter()
  return (
    <>
      <div className="flex gap-6 items-center">
        <button
          className="cursor-pointer"
          onClick={() => {
            router.push('/')
          }}
        >
          <p className="font-heading-20">GROUP BUY</p>
        </button>
        <NavMenu
          items={DESKTOP_PRIMARY_NAV_ITEMS}
          interactionMode="hover"
          onSelectItem={(item) => {
            console.log('select', item)
          }}
          onNavigate={({ item, parentId }) => {
            console.log('navigate', item, parentId)
          }}
        />
      </div>
      <NavMenu
        items={DESKTOP_SECONDARY_NAV_ITEMS}
        interactionMode="hover"
        onSelectItem={(item) => {
          console.log('select', item)
        }}
        onNavigate={({ item, parentId }) => {
          console.log('navigate', item, parentId)
        }}
      />
    </>
  )
}
