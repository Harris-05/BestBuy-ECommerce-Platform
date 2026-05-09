import ProductCard from './ProductCard'

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-52 bg-surface-dim rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-surface-dim rounded w-1/3" />
        <div className="h-4 bg-surface-dim rounded w-full" />
        <div className="h-4 bg-surface-dim rounded w-3/4" />
        <div className="h-3 bg-surface-dim rounded w-1/4" />
        <div className="h-5 bg-surface-dim rounded w-1/3 mt-2" />
        <div className="h-9 bg-surface-dim rounded mt-2" />
      </div>
    </div>
  )
}

export default function ProductGrid({ products = [], loading = false, columns = 4 }) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns] ?? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  if (loading) {
    return (
      <div className={`grid ${gridCols} gap-4`}>
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-ink-muted gap-3">
        <img src="https://placehold.co/120x120?text=Empty" alt="no results" className="opacity-40 rounded-lg" />
        <p className="font-headline text-headline-sm">No products found</p>
        <p className="text-body-sm">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {products.map(p => (
        <ProductCard key={p._id ?? p.id ?? p.slug} product={p} />
      ))}
    </div>
  )
}
