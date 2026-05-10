import { useSearchParams } from 'react-router-dom'
import { Star } from 'lucide-react'

const CATEGORIES = [
  'Electronics', 'Clothing', 'Books', 'Home & Kitchen',
  'Sports', 'Beauty', 'Toys', 'Automotive',
]

const PRICE_RANGES = [
  { label: 'Under $25',        min: '',   max: '25' },
  { label: '$25 – $50',        min: '25', max: '50' },
  { label: '$50 – $100',       min: '50', max: '100' },
  { label: '$100 – $200',      min: '100', max: '200' },
  { label: '$200 & Above',     min: '200', max: '' },
]

export default function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = {
    category: searchParams.get('category') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    rating:   searchParams.get('rating')   ?? '',
    sort:     searchParams.get('sort')     ?? 'newest',
  }

  const update = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    newParams.set('page', '1') // Reset to page 1 on filter change
    setSearchParams(newParams)
  }

  const clearAll = () => {
    setSearchParams({})
  }

  return (
    <aside className="w-full space-y-6">

      {/* Category */}
      <div>
        <h3 className="font-headline font-semibold text-body-md mb-3 text-ink border-b border-border pb-2">
          Department
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => update('category', '')}
              className={`w-full text-left text-body-sm px-2 py-1.5 rounded transition-colors ${!filters.category ? 'font-semibold text-navy' : 'text-ink-muted hover:text-ink'}`}
            >
              All Categories
            </button>
          </li>
          {CATEGORIES.map(cat => (
            <li key={cat}>
              <button
                onClick={() => update('category', cat)}
                className={`w-full text-left text-body-sm px-2 py-1.5 rounded transition-colors ${filters.category === cat ? 'font-semibold text-navy' : 'text-ink-muted hover:text-ink'}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-headline font-semibold text-body-md mb-3 text-ink border-b border-border pb-2">
          Price
        </h3>
        <ul className="space-y-1">
          {PRICE_RANGES.map(r => (
            <li key={r.label}>
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams)
                  if (r.min) newParams.set('minPrice', r.min); else newParams.delete('minPrice')
                  if (r.max) newParams.set('maxPrice', r.max); else newParams.delete('maxPrice')
                  newParams.set('page', '1')
                  setSearchParams(newParams)
                }}
                className={`w-full text-left text-body-sm px-2 py-1.5 rounded transition-colors ${
                  filters.minPrice === r.min && filters.maxPrice === r.max
                    ? 'font-semibold text-navy'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
        {/* Custom price */}
        <div className="flex gap-2 mt-3">
          <input
            type="number"
            value={filters.minPrice}
            onChange={e => update('minPrice', e.target.value)}
            placeholder="Min"
            className="input py-1.5 px-2 text-body-sm"
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={e => update('maxPrice', e.target.value)}
            placeholder="Max"
            className="input py-1.5 px-2 text-body-sm"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-headline font-semibold text-body-md mb-3 text-ink border-b border-border pb-2">
          Avg. Customer Review
        </h3>
        <ul className="space-y-1">
          {[4, 3, 2, 1].map(stars => (
            <li key={stars}>
              <button
                onClick={() => update('rating', stars === Number(filters.rating) ? '' : String(stars))}
                className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-body-sm transition-colors ${filters.rating === String(stars) ? 'text-navy font-semibold' : 'text-ink-muted hover:text-ink'}`}
              >
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={13} className={s <= stars ? 'fill-orange text-orange' : 'fill-none text-gray-300'} />
                  ))}
                </div>
                <span>& Up</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-headline font-semibold text-body-md mb-3 text-ink border-b border-border pb-2">
          Sort By
        </h3>
        <select
          value={filters.sort}
          onChange={e => update('sort', e.target.value)}
          className="input text-body-sm py-2"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="best_seller">Best Sellers</option>
          <option value="rating">Avg. Customer Review</option>
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={clearAll}
        className="btn-secondary w-full text-body-sm"
      >
        Clear All Filters
      </button>
    </aside>
  )
}
