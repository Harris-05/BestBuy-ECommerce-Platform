import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart, Heart, Share2, ChevronLeft, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import { fetchProductBySlug, clearCurrent, fetchProducts } from '../store/productsSlice'
import { useCart } from '../hooks/useCart'
import StarRating from '../components/shop/StarRating'
import ReviewForm from '../components/shop/ReviewForm'
import ProductGrid from '../components/shop/ProductGrid'

export default function ProductDetail() {
  const { slug }   = useParams()
  const dispatch   = useDispatch()
  const { current: product, status, items: related } = useSelector(s => s.products)
  const { addItem, openDrawer } = useCart()

  const [activeImg, setActiveImg] = useState(0)
  const [qty,       setQty]       = useState(1)
  const [tab,       setTab]       = useState('reviews')
  const [reviewKey, setReviewKey] = useState(0)

  useEffect(() => {
    dispatch(fetchProductBySlug(slug))
    return () => dispatch(clearCurrent())
  }, [slug, dispatch])

  useEffect(() => {
    if (product?.category) {
      const categoryName = typeof product.category === 'object' ? product.category.name : product.category
      dispatch(fetchProducts({ category: categoryName, limit: 4 }))
    }
  }, [product?.category, dispatch])

  if (status === 'loading' || !product) {
    return (
      <div className="container-content py-10">
        <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
          <div className="bg-surface-dim rounded-xl h-96" />
          <div className="space-y-4">
            <div className="h-6 bg-surface-dim rounded w-3/4" />
            <div className="h-4 bg-surface-dim rounded w-1/3" />
            <div className="h-8 bg-surface-dim rounded w-1/4 mt-4" />
            <div className="h-12 bg-surface-dim rounded mt-6" />
          </div>
        </div>
      </div>
    )
  }

  const images = product.images?.length ? product.images : ['https://placehold.co/600x450?text=No+Image']
  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : 0

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product._id,
        name:  product.name,
        price: Number(product.price),
        image: images[0],
        slug:  product.slug,
      })
    }
    openDrawer()
  }

  return (
    <div className="container-content py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-label-sm text-ink-muted mb-5">
        <Link to="/" className="hover:text-navy transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-navy transition-colors">Products</Link>
        {product.category && (
          <><span>/</span>
          <Link to={`/products?category=${encodeURIComponent(typeof product.category === 'object' ? product.category.name : product.category)}`} className="hover:text-navy transition-colors">
            {typeof product.category === 'object' ? product.category.name : product.category}
          </Link></>
        )}
        <span>/</span>
        <span className="text-ink truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main product section */}
      <div className="grid lg:grid-cols-2 gap-10">

        {/* Images */}
        <div className="space-y-3">
          <div className="card overflow-hidden">
            <img
              src={images[activeImg]}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-navy' : 'border-border'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          {product.isBestSeller && <span className="badge">Best Seller</span>}

          <h1 className="font-headline font-bold text-headline-lg text-ink leading-tight">
            {product.name}
          </h1>

          {/* Rating summary */}
          <div className="flex items-center gap-3">
            <StarRating rating={avgRating} count={product.reviews?.length ?? 0} size={16} />
            <Link to="#reviews" className="text-body-sm text-navy hover:underline">
              {product.reviews?.length ?? 0} ratings
            </Link>
          </div>

          <hr className="border-border" />

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="font-headline font-bold text-headline-lg text-ink">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-body-md text-ink-faint line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>
            {product.freeDelivery && (
              <p className="flex items-center gap-1.5 text-body-sm text-green-600">
                <Truck size={14} />FREE Delivery
              </p>
            )}
          </div>

          {/* Description excerpt */}
          <p className="text-body-md text-ink-muted leading-relaxed line-clamp-4">
            {product.description}
          </p>

          {/* Stock */}
          {product.stock !== undefined && (
            <p className={`text-body-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          )}

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-border rounded overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-surface-section transition-colors text-ink-muted">−</button>
              <span className="px-4 py-2 text-body-md font-medium">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock ?? 99, q + 1))} className="px-3 py-2 hover:bg-surface-section transition-colors text-ink-muted">+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex-1 justify-center disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button className="p-2.5 rounded border border-border hover:border-navy text-ink-muted hover:text-navy transition-colors">
              <Heart size={18} />
            </button>
            <button className="p-2.5 rounded border border-border hover:border-navy text-ink-muted hover:text-navy transition-colors">
              <Share2 size={18} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { icon: ShieldCheck, label: 'Secure Checkout' },
              { icon: RotateCcw,   label: '30-Day Returns' },
              { icon: Truck,       label: 'Fast Delivery' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 bg-surface-section rounded-lg p-3 text-center">
                <Icon size={18} className="text-navy" />
                <span className="text-label-sm text-ink-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Description / Reviews */}
      <div className="mt-10" id="reviews">
        <div className="flex border-b border-border mb-6">
          {['description', 'reviews'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-body-md font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-orange text-ink' : 'border-transparent text-ink-muted hover:text-ink'}`}
            >
              {t === 'reviews' ? `Reviews (${product.reviews?.length ?? 0})` : 'Description'}
            </button>
          ))}
        </div>

        {tab === 'description' && (
          <div className="card p-6 prose prose-sm max-w-none text-ink-muted leading-relaxed">
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="space-y-6">
            {/* Rating summary */}
            <div className="card p-6 flex gap-8 items-center">
              <div className="text-center">
                <p className="font-headline font-bold text-5xl text-ink">{avgRating.toFixed(1)}</p>
                <StarRating rating={avgRating} size={18} />
                <p className="text-label-sm text-ink-faint mt-1">{product.reviews?.length ?? 0} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5,4,3,2,1].map(star => {
                  const count = product.reviews?.filter(r => Math.round(r.rating) === star).length ?? 0
                  const pct   = product.reviews?.length ? (count / product.reviews.length) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2 text-label-sm">
                      <span className="w-4 text-right text-ink-muted">{star}</span>
                      <div className="flex-1 bg-surface-section rounded-full h-2">
                        <div className="bg-orange h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-ink-faint w-6">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Individual reviews */}
            <div className="space-y-4">
              {product.reviews?.map((r, i) => (
                <div key={i} className="card p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center font-headline font-bold text-body-sm">
                        {(r.user?.name ?? 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-body-sm text-ink">{r.user?.name ?? 'Anonymous'}</p>
                        <p className="text-label-sm text-ink-faint">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} size={13} />
                  </div>
                  <p className="text-body-sm text-ink-muted leading-relaxed">{r.comment}</p>
                  {r.reply && (
                    <div className="mt-2 pl-4 border-l-2 border-orange">
                      <p className="text-label-sm text-navy font-semibold">Seller Reply</p>
                      <p className="text-body-sm text-ink-muted mt-0.5">{r.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Write review */}
            <ReviewForm
              key={reviewKey}
              productId={product._id}
              onSuccess={() => {
                setReviewKey(k => k + 1)
                dispatch(fetchProductBySlug(slug))
              }}
            />
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-headline font-bold text-headline-md text-ink mb-5">
            Related Products
          </h2>
          <ProductGrid products={related.filter(p => p._id !== product._id).slice(0, 4)} columns={4} />
        </section>
      )}
    </div>
  )
}
