import { FilterSidebar } from '@/components/shop/FilterSidebar'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { SearchBar } from '@/components/shop/SearchBar'

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; minPrice?: string; maxPrice?: string; sort?: string; page?: string }
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <SearchBar />
      </div>
      <div className="flex gap-8">
        <aside className="w-64 shrink-0 hidden md:block">
          <FilterSidebar />
        </aside>
        <main className="flex-1">
          <ProductGrid searchParams={searchParams} />
        </main>
      </div>
    </div>
  )
}
