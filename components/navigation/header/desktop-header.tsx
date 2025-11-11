import { NavMenu } from '../nav-menu'
import { DESKTOP_PRIMARY_NAV_ITEMS, DESKTOP_SECONDARY_NAV_ITEMS } from '../consts'

export function DesktopHeader() {
  return (
    <>
      <div className="flex gap-6 items-center">
        <p className="text-heading-20">GROUP BUY</p>
        <NavMenu
          items={DESKTOP_PRIMARY_NAV_ITEMS}
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
