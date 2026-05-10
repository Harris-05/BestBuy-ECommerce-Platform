import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { fetchProducts, setFilter, setPage } from '../store/productsSlice'
import ProductGrid   from '../components/shop/ProductGrid'
import FilterSidebar from '../components/shop/FilterSidebar'
import { useDebounce } from '../hooks/useDebounce'

export default function Products() {
  const dispatch = useDispatch()
  const { items, status, total, totalPages, page, filters } = useSelector(s => s.products)
  const [searchParams] = useSearchParams()
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const debouncedSearch = useDebounce(filters.search, 400)

  useEffect(() => {
    const search   = searchParams.get('search')   ?? searchParams.get('q') ?? ''
    const category = searchParams.get('category') ?? ''
    const sort     = searchParams.get('sort')     ?? 'newest'
    const minPrice = searchParams.get('minPrice') ?? ''
    const maxPrice = searchParams.get('maxPrice') ?? ''
    const rating   = searchParams.get('rating')   ?? ''
    const pageNum  = parseInt(searchParams.get('page') ?? '1', 10)
    
    dispatch(setFilter({ search, category, sort, minPrice, maxPrice, rating }))
    dispatch(setPage(pageNum))
  }, [searchParams, dispatch])

  /* Refetch whenever filters or page change */
  useEffect(() => {
    dispatch(fetchProducts({
      search:   debouncedSearch,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort:     filters.sort,
      rating:   filters.rating,
      page,
      limit:    20,
    }))
  }, [dispatch, debouncedSearch, filters.category, filters.minPrice, filters.maxPrice, filters.sort, filters.rating, page])

  const loading = status === 'loading'

  return (
    <div className="container-content py-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-headline font-bold text-headline-md text-ink">
            {filters.category ? filters.category : 'All Products'}
          </h1>
          {!loading && <p className="text-body-sm text-ink-muted mt-0.5">{total} results</p>}
        </div>
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowMobileFilter(o => !o)}
          className="lg:hidden btn-secondary gap-2 text-body-sm py-2"
        >
          <SlidersHorizontal size={16} />Filters
        </button>
      </div>

      {/* Active filter chips */}
      {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.rating) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.search   && <FilterChip label={`"${filters.search}"`}   onRemove={() => { const p = new URLSearchParams(searchParams); p.delete('search'); p.set('page','1'); setSearchParams(p) }} />}
          {filters.category && <FilterChip label={filters.category}         onRemove={() => { const p = new URLSearchParams(searchParams); p.delete('category'); p.set('page','1'); setSearchParams(p) }} />}
          {(filters.minPrice || filters.maxPrice) && (
            <FilterChip
              label={`$${filters.minPrice || '0'} – $${filters.maxPrice || '∞'}`}
              onRemove={() => { const p = new URLSearchParams(searchParams); p.delete('minPrice'); p.delete('maxPrice'); p.set('page','1'); setSearchParams(p) }}
            />
          )}
          {filters.rating   && <FilterChip label={`${filters.rating}★ & up`} onRemove={() => { const p = new URLSearchParams(searchParams); p.delete('rating'); p.set('page','1'); setSearchParams(p) }} />}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar — desktop */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <FilterSidebar />
        </div>

        {/* Mobile filter drawer */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 bg-navy-deep/40 lg:hidden" onClick={() => setShowMobileFilter(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-5 overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline font-semibold text-headline-sm">Filters</h3>
                <button onClick={() => setShowMobileFilter(false)}><X size={18} /></button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4 bg-white border border-border rounded-lg px-4 py-2.5">
            <p className="text-body-sm text-ink-muted hidden sm:block">
              {loading ? 'Loading…' : `Showing 1–${Math.min(20, total)} of ${total}`}
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-label-md text-ink-muted">Sort:</span>
              <select
                value={filters.sort}
                onChange={e => { const p = new URLSearchParams(searchParams); p.set('sort', e.target.value); p.set('page', '1'); setSearchParams(p) }}
                className="border-none text-body-sm focus:outline-none cursor-pointer text-ink"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="best_seller">Best Sellers</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <ProductGrid products={items} loading={loading} columns={3} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', String(page - 1)); setSearchParams(p) }}
                disabled={page <= 1}
                className="btn-secondary px-4 py-2 text-body-sm disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => { const params = new URLSearchParams(searchParams); params.set('page', String(p)); setSearchParams(params) }}
                  className={`w-9 h-9 rounded text-body-sm ${p === page ? 'bg-navy text-white' : 'btn-secondary'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', String(page + 1)); setSearchParams(p) }}
                disabled={page >= totalPages}
                className="btn-secondary px-4 py-2 text-body-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 bg-white border border-border text-body-sm text-ink px-3 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="text-ink-faint hover:text-ink"><X size={13} /></button>
    </span>
  )
}
