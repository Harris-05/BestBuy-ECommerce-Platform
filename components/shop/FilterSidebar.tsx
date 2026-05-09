'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty']
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/products?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <ul className="space-y-2 text-sm">
          {categories.map(cat => (
            <li key={cat}>
              <button
                onClick={() => updateParam('category', cat.toLowerCase())}
                className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${searchParams.get('category') === cat.toLowerCase() ? 'font-bold text-[#e94560]' : ''}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="flex gap-2 text-sm">
          <input type="number" placeholder="Min" className="w-full border p-1 rounded" onChange={e => updateParam('minPrice', e.target.value)} />
          <input type="number" placeholder="Max" className="w-full border p-1 rounded" onChange={e => updateParam('maxPrice', e.target.value)} />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Sort By</h3>
        <select className="w-full border p-2 rounded text-sm" onChange={e => updateParam('sort', e.target.value)} defaultValue={searchParams.get('sort') ?? ''}>
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  )
}
