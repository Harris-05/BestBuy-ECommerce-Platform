import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3 } from 'lucide-react'

const links = [
  { to: '/admin/dashboard',   label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/dashboard#Products', label: 'Products',   icon: Package },
  { to: '/admin/dashboard#Orders',   label: 'Orders',     icon: ShoppingBag },
  { to: '/admin/dashboard#Users',    label: 'Users',      icon: Users },
]

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-navy text-white p-4">
      <p className="text-label-sm text-gray-400 uppercase tracking-widest mb-3 px-2">Admin</p>
      <nav className="space-y-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm transition-colors ${isActive ? 'bg-orange text-navy-deep font-semibold' : 'text-gray-300 hover:bg-navy-light'}`
            }
          >
            <link.icon size={16} />{link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
