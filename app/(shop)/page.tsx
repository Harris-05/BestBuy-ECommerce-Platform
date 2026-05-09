import { ProductGrid } from '@/components/shop/ProductGrid'
import { SearchBar } from '@/components/shop/SearchBar'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1a1a2e] text-white py-24 px-6 text-center">
        <h1 className="font-playfair text-5xl font-bold mb-4">Discover Your Next Favourite Thing</h1>
        <p className="text-gray-300 mb-8">AI-powered shopping designed around you.</p>
        <div className="flex gap-4 justify-center">
          <a href="/products" className="bg-[#e94560] px-6 py-3 rounded font-medium">Shop Now</a>
          <a href="/about" className="border border-white px-6 py-3 rounded font-medium">Learn More</a>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-2xl mx-auto py-10 px-4">
        <SearchBar />
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-playfair text-3xl font-bold mb-8">Featured Products</h2>
        <ProductGrid />
      </section>
    </>
  )
}
