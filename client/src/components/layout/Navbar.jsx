'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, Menu } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { SearchBar } from '@/components/shop/SearchBar'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const { items } = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#1a1a2e] text-white px-4 py-3 flex items-center gap-6">
        <Link href="/" className="font-playfair text-xl font-bold text-[#e94560]">ShopSmart</Link>

        <div className="hidden md:flex gap-6 text-sm">
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          {session?.user.role === 'ADMIN' && <Link href="/admin">Admin</Link>}
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:block w-64">
            <SearchBar />
          </div>

          <button onClick={() => setDrawerOpen(true)} className="relative">
            <ShoppingCart size={20} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#e94560] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>

          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/account"><User size={20} /></Link>
              <button onClick={() => signOut()} className="text-sm text-gray-300 hover:text-white">Logout</button>
            </div>
          ) : (
            <div className="flex gap-3 text-sm">
              <Link href="/login" className="text-gray-300 hover:text-white">Login</Link>
              <Link href="/signup" className="bg-[#e94560] px-3 py-1 rounded">Sign Up</Link>
            </div>
          )}

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}><Menu size={20} /></button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-[#16213e] text-white px-4 py-4 space-y-3 text-sm">
          <Link href="/products" onClick={() => setMenuOpen(false)} className="block">Products</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block">About</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="block">Contact</Link>
          {session?.user.role === 'ADMIN' && <Link href="/admin" className="block">Admin</Link>}
        </div>
      )}

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
