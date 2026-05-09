import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Search, MapPin, ChevronDown, Package } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

const CATEGORIES = [
  'Electronics', 'Clothing', 'Books', 'Home & Kitchen',
  'Sports', 'Beauty', 'Toys', 'Automotive',
]

export default function Navbar() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isSeller, isAdmin, logout } = useAuth()
  const { count, openDrawer } = useCart()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <>
      {/* ── Top promo strip ── */}
      <div className="bg-navy-deep text-white text-center text-label-sm py-1.5 px-4">
        Free delivery on orders over $35 · Fast shipping guaranteed
      </div>

      {/* ── Main navbar ── */}
      <header className="sticky top-0 z-40 bg-navy text-white shadow-md">
        <div className="container-content flex items-center gap-4 py-2.5">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="font-headline text-xl font-bold tracking-tight">
              bestbuy<span className="text-orange">Market</span>
            </span>
          </Link>

          {/* Deliver to (desktop) */}
          <div className="hidden lg:flex flex-col cursor-pointer hover:ring-1 hover:ring-white rounded px-2 py-1">
            <span className="text-[11px] text-gray-300">Deliver to</span>
            <span className="flex items-center gap-1 text-label-sm font-semibold">
              <MapPin size={13} />Pakistan
            </span>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl rounded overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products, brands and more…"
              className="flex-1 px-4 py-2 text-ink text-body-sm focus:outline-none bg-white placeholder-ink-faint"
            />
            <button
              type="submit"
              className="px-4 bg-orange hover:bg-orange-hover transition-colors flex items-center"
            >
              <Search size={18} className="text-navy-deep" />
            </button>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Account dropdown */}
            {isAuthenticated ? (
              <div className="group relative">
                <button className="flex flex-col items-start px-3 py-1 hover:ring-1 hover:ring-white rounded text-left">
                  <span className="text-[11px] text-gray-300">Hello, {user?.name?.split(' ')[0]}</span>
                  <span className="flex items-center gap-0.5 text-label-sm font-semibold">
                    Account <ChevronDown size={12} />
                  </span>
                </button>
                {/* dropdown */}
                <div className="absolute right-0 mt-1 w-48 bg-white text-ink rounded-lg shadow-dropdown border border-border hidden group-hover:block z-50">
                  <Link to="/profile" className="block px-4 py-2 text-body-sm hover:bg-surface-section">Your Profile</Link>
                  <Link to="/profile#orders" className="block px-4 py-2 text-body-sm hover:bg-surface-section">Your Orders</Link>
                  {isSeller && <Link to="/seller/dashboard" className="block px-4 py-2 text-body-sm hover:bg-surface-section">Seller Dashboard</Link>}
                  {isAdmin && <Link to="/admin/dashboard" className="block px-4 py-2 text-body-sm hover:bg-surface-section">Admin Dashboard</Link>}
                  <hr className="border-border" />
                  <button onClick={() => { logout(); navigate('/') }} className="block w-full text-left px-4 py-2 text-body-sm hover:bg-surface-section text-red-600">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex flex-col items-start px-3 py-1 hover:ring-1 hover:ring-white rounded">
                <span className="text-[11px] text-gray-300">Hello, sign in</span>
                <span className="flex items-center gap-0.5 text-label-sm font-semibold">
                  Account <ChevronDown size={12} />
                </span>
              </Link>
            )}

            {/* Orders */}
            <Link to="/profile#orders" className="hidden md:flex flex-col items-start px-3 py-1 hover:ring-1 hover:ring-white rounded">
              <span className="text-[11px] text-gray-300">Returns</span>
              <span className="text-label-sm font-semibold flex items-center gap-1">
                <Package size={13} />Orders
              </span>
            </Link>

            {/* Cart */}
            <button
              onClick={openDrawer}
              className="flex items-center gap-1.5 px-3 py-1 hover:ring-1 hover:ring-white rounded relative"
            >
              <span className="relative">
                <ShoppingCart size={22} />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange text-navy-deep text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </span>
              <span className="hidden md:inline text-label-sm font-semibold self-end pb-0.5">Cart</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 hover:ring-1 hover:ring-white rounded"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Category nav bar ── */}
        <nav className="bg-navy-light hidden md:block">
          <div className="container-content flex items-center gap-6 py-1.5 overflow-x-auto scrollbar-none text-body-sm">
            <Link to="/products" className="whitespace-nowrap font-semibold flex items-center gap-1 hover:text-orange transition-colors">
              <Menu size={16} />All
            </Link>
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="whitespace-nowrap hover:text-orange transition-colors"
              >
                {cat}
              </Link>
            ))}
            <Link to="/products?sort=best_seller" className="whitespace-nowrap text-orange font-semibold hover:underline">Best Sellers</Link>
            <Link to="/products?sort=newest" className="whitespace-nowrap hover:text-orange transition-colors">New Arrivals</Link>
          </div>
        </nav>
      </header>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-deep text-white px-4 py-4 space-y-3 text-body-sm z-30 relative">
          <form onSubmit={handleSearch} className="flex rounded overflow-hidden mb-4">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search…"
              className="flex-1 px-3 py-2 text-ink text-body-sm focus:outline-none bg-white"
            />
            <button type="submit" className="px-4 bg-orange">
              <Search size={16} className="text-navy-deep" />
            </button>
          </form>
          {CATEGORIES.map(cat => (
            <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} onClick={() => setMobileOpen(false)} className="block hover:text-orange">
              {cat}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-3 pt-2 border-t border-navy-light">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 bg-orange text-navy-deep font-semibold rounded">Sign In</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 border border-white rounded">Register</Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}
