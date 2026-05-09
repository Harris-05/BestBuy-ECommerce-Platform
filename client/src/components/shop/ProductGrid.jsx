import { ProductCard } from './ProductCard'

type SearchParams = {
  q?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  page?: string
}

async function fetchProducts(searchParams: SearchParams) {
  const params = new URLSearchParams()
  Object.entries(searchParams).forEach(([k, v]) => v && params.set(k, v))
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?${params}`, { cache: 'no-store' })
  return res.json()
}

export async function ProductGrid({ searchParams = {} }: { searchParams?: SearchParams }) {
  const products = await fetchProducts(searchParams)

  if (!products.length)
    return <p className="text-center text-gray-500 py-12">No products found.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
