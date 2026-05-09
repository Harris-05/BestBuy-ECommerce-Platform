'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/users', label: 'Users' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-[#16213e] text-gray-300 p-4">
      <nav className="space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded text-sm ${pathname === link.href ? 'bg-[#e94560] text-white' : 'hover:bg-gray-700'}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
