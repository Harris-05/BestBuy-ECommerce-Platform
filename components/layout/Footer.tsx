import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-gray-300 px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="font-playfair text-white text-xl font-bold mb-2">ShopSmart</p>
          <p className="text-sm">AI-powered shopping for everyone.</p>
        </div>

        <div>
          <p className="font-semibold text-white mb-3">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products">All Products</Link></li>
            <li><Link href="/products?category=sale">Sale</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-3">Account</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/account/orders">My Orders</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-3">Company</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-700 text-sm text-center">
        &copy; {new Date().getFullYear()} ShopSmart. All rights reserved.
      </div>
    </footer>
  )
}
