'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { StarRating } from './StarRating'
import { useCart } from '@/hooks/useCart'

type Product = {
  id: string
  slug: string
  name: string
  price: number | string
  images: string[]
  reviews: { rating: number }[]
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <Link href={`/products/${product.slug}`}>
        <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
        <div className="p-4 space-y-1">
          <p className="font-medium truncate">{product.name}</p>
          <StarRating rating={avgRating} />
          <p className="text-[#e94560] font-bold">${product.price}</p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={() => addItem(product.id)}
          className="w-full bg-[#1a1a2e] text-white py-2 rounded text-sm hover:bg-[#e94560] transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}
