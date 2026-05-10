import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Truck, Shield, RotateCcw, Headphones, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/productsSlice'
import ProductGrid from '../components/shop/ProductGrid'

/* ── Hero slides ── */
const SLIDES = [
  {
    title:    'Deals of the Day',
    subtitle: 'Up to 60% off on Electronics',
    cta:      'Shop Now',
    to:       '/products?category=Electronics',
    bg:       'from-navy-deep to-navy',
    img:      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format',
  },
  {
    title:    'New Season Fashion',
    subtitle: 'Explore the latest arrivals',
    cta:      'View Collection',
    to:       '/products?category=Clothing',
    bg:       'from-navy to-navy-light',
    img:      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&auto=format',
  },
  {
    title:    'Home Essentials',
    subtitle: 'Make your space perfect',
    cta:      'Explore Now',
    to:       '/products?category=Home+%26+Kitchen',
    bg:       'from-navy-light to-navy',
    img:      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format',
  },
]

/* ── Category cards ── */
const CATEGORY_CARDS = [
  { label: 'Electronics',    emoji: '📱', to: '/products?category=Electronics' },
  { label: 'Clothing',       emoji: '👗', to: '/products?category=Clothing' },
  { label: 'Books',          emoji: '📚', to: '/products?category=Books' },
  { label: 'Home & Kitchen', emoji: '🏠', to: '/products?category=Home+%26+Kitchen' },
  { label: 'Sports',         emoji: '⚽', to: '/products?category=Sports' },
  { label: 'Beauty',         emoji: '💄', to: '/products?category=Beauty' },
  { label: 'Toys',           emoji: '🧸', to: '/products?category=Toys' },
  { label: 'Automotive',     emoji: '🚗', to: '/products?category=Automotive' },
]

/* ── Trust badges ── */
const TRUST_ITEMS = [
  { icon: Truck,       label: 'Free Delivery',       sub: 'On orders over $35' },
  { icon: Shield,      label: 'Secure Payments',     sub: 'SSL & trusted gateways' },
  { icon: RotateCcw,   label: 'Easy Returns',        sub: '30-day return policy' },
  { icon: Headphones,  label: '24/7 Support',         sub: 'Always here to help' },
]

function HeroCarousel() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[idx]

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${slide.bg} text-white min-h-[320px] sm:min-h-[380px]`}>
      {/* Background image */}
      <img
        src={slide.img}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20 transition-opacity duration-700"
      />
      <div className="relative container-content py-12 sm:py-16 lg:py-24 flex flex-col items-center md:items-start gap-4 sm:gap-5 max-w-lg sm:max-w-xl text-center md:text-left">
        <span className="badge-orange w-fit text-label-sm">Limited Time Offer</span>
        <h1 className="font-headline text-headline-lg sm:text-headline-xl leading-tight">{slide.title}</h1>
        <p className="text-body-md sm:text-body-lg text-gray-200">{slide.subtitle}</p>
        <Link to={slide.to} className="btn-primary w-fit text-body-md px-5 sm:px-7 py-3">
          {slide.cta} <ArrowRight size={18} />
        </Link>
      </div>

      {/* Arrows */}
      <button
        onClick={() => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length)}
        className="hidden sm:block absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setIdx(i => (i + 1) % SLIDES.length)}
        className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-orange' : 'bg-white/40'}`} />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const dispatch  = useDispatch()
  const { items: products, status } = useSelector(s => s.products)
  const loading   = status === 'loading'

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }))
  }, [dispatch])

  return (
    <div>

      {/* Hero */}
      <HeroCarousel />

      {/* Trust bar */}
      <div className="bg-white border-b border-border">
        <div className="container-content py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-light flex-shrink-0">
                  <Icon size={20} className="text-orange-hover" />
                </div>
                <div>
                  <p className="font-headline font-semibold text-body-sm text-ink">{label}</p>
                  <p className="text-label-sm text-ink-faint">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category grid */}
      <section className="container-content py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <h2 className="font-headline font-bold text-headline-md text-ink">Shop by Category</h2>
          <Link to="/products" className="text-body-sm text-navy hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORY_CARDS.map(cat => (
            <Link
              key={cat.label}
              to={cat.to}
              className="card flex flex-col items-center gap-2 p-4 text-center hover:shadow-card-hover hover:border-navy transition-all group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="text-label-md text-ink group-hover:text-navy transition-colors">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <div className="bg-navy text-white py-12">
        <div className="container-content flex flex-col lg:flex-row items-center gap-6 justify-between text-center lg:text-left">
          <div>
            <p className="text-label-sm text-orange uppercase tracking-widest mb-1">Flash Sale</p>
            <h2 className="font-headline font-bold text-headline-lg">Up to 70% Off Today Only</h2>
            <p className="text-body-md text-gray-300 mt-1">Limited stock — don't miss out on these incredible deals.</p>
          </div>
          <Link to="/products?sort=best_seller" className="btn-primary w-full sm:w-auto justify-center whitespace-nowrap px-8 py-3 text-body-md">
            Shop the Sale <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Featured products */}
      <section className="container-content py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-headline font-bold text-headline-md text-ink">Featured Products</h2>
          <Link to="/products" className="text-body-sm text-navy hover:underline flex items-center gap-1">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid products={products} loading={loading} columns={4} />
      </section>

      {/* Best sellers strip */}
      <div className="bg-orange-light border-y border-orange/20 py-10">
        <div className="container-content">
          <div className="flex items-center gap-3 mb-5">
            <Star size={22} className="fill-orange text-orange" />
            <h2 className="font-headline font-bold text-headline-md text-ink">Best Sellers</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty'].map(cat => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}&sort=best_seller`}
                className="chip whitespace-nowrap flex-shrink-0"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <section className="bg-navy-deep text-white py-14">
        <div className="container-content max-w-2xl text-center mx-auto">
          <h2 className="font-headline font-bold text-headline-md mb-2">Stay in the Loop</h2>
          <p className="text-body-md text-gray-300 mb-6">Get exclusive deals, early access to sales, and new arrivals delivered to your inbox.</p>
          <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="input flex-1 bg-navy-light border-navy-light text-white placeholder-gray-400 focus:border-orange" />
            <button type="submit" className="btn-primary w-full sm:w-auto whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  )
}
