import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import StarRating from './StarRating'
import { useCart } from '../../hooks/useCart'
import { resolveImage } from '../../lib/shop-utils'

export default function ProductCard({ product }) {
  const { addItem, openDrawer } = useCart()

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : product.rating ?? 0
  const reviewCount = product.reviews?.length ?? product.reviewCount ?? 0
  const image = resolveImage(Array.isArray(product.images) ? product.images[0] : (product.image ?? product.images))
  const slug  = product.slug ?? product._id ?? product.id

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem({
      productId: product._id ?? product.id,
      name:      product.name,
      price:     Number(product.price),
      image,
      slug,
    })
    openDrawer()
  }

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="card group flex flex-col overflow-hidden hover:shadow-card-hover transition-shadow"
    >
      <Link to={`/products/${slug}`} className="block overflow-hidden">
        <img
          src={image}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Badges */}
      {product.isBestSeller && (
        <span className="badge absolute top-3 left-3">Best Seller</span>
      )}

      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category */}
        {product.category && (
          <span className="text-label-sm text-ink-faint uppercase tracking-wide">
            {typeof product.category === 'object' ? product.category.name : product.category}
          </span>
        )}

        {/* Name */}
        <Link to={`/products/${slug}`}>
          <h3 className="text-body-md font-medium text-ink line-clamp-2 group-hover:text-navy transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <StarRating rating={avgRating} count={reviewCount} />

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="font-headline text-headline-sm text-ink">${Number(product.price).toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-body-sm text-ink-faint line-through">
              ${Number(product.originalPrice).toFixed(2)}
            </span>
          )}
          {product.originalPrice && (
            <span className="badge-orange text-[11px]">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% off
            </span>
          )}
        </div>

        {/* Delivery */}
        {product.freeDelivery && (
          <p className="text-label-sm text-green-600">FREE Delivery</p>
        )}

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="btn-primary w-full mt-2 text-body-sm"
        >
          <ShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </motion.article>
  )
}
