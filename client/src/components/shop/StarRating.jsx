import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, count, size = 14 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating)
            ? 'fill-orange text-orange'
            : 'fill-none text-gray-300'}
        />
      ))}
      {count !== undefined && (
        <span className="text-label-sm text-ink-muted ml-1">({count})</span>
      )}
    </div>
  )
}
