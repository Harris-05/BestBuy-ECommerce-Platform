import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import StarRating from '../components/shop/StarRating'
import { resolveImage } from '../lib/shop-utils'

export default function Cart() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart()

  if (!items.length) {
    return (
      <div className="container-content py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-ink-faint mb-4" />
        <h2 className="font-headline font-bold text-headline-md text-ink mb-2">Your cart is empty</h2>
        <p className="text-body-md text-ink-muted mb-6">Browse our products and add items to your cart.</p>
        <Link to="/products" className="btn-primary inline-flex">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container-content py-8">
      <h1 className="font-headline font-bold text-headline-md text-ink mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.productId} className="card p-4 flex gap-4">
              <Link to={`/products/${item.slug}`}>
                <img src={resolveImage(item.image)} alt={item.name} className="w-24 h-24 object-cover rounded-md border border-border" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.slug}`} className="font-medium text-body-md text-ink hover:text-navy line-clamp-2">{item.name}</Link>
                <p className="text-body-sm text-green-600 mt-0.5">In Stock</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-border rounded overflow-hidden">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2.5 py-1 hover:bg-surface-section text-ink-muted text-lg leading-none">−</button>
                    <span className="px-3 py-1 text-body-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2.5 py-1 hover:bg-surface-section text-ink-muted text-lg leading-none">+</button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="flex items-center gap-1 text-body-sm text-red-500 hover:text-red-700">
                    <Trash2 size={14} />Delete
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-headline font-bold text-body-md text-ink">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-label-sm text-ink-faint mt-0.5">${item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button onClick={clearCart} className="text-body-sm text-red-500 hover:underline flex items-center gap-1">
              <Trash2 size={14} />Clear Cart
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 space-y-4">
            <h2 className="font-headline font-semibold text-headline-sm text-ink">Order Summary</h2>
            <div className="space-y-2 text-body-sm">
              <div className="flex justify-between text-ink-muted"><span>Subtotal ({items.length} items)</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between text-ink-muted"><span>Shipping</span><span className="text-green-600">FREE</span></div>
              <hr className="border-border" />
              <div className="flex justify-between font-headline font-bold text-body-md text-ink">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full justify-center">Proceed to Checkout</Link>
            <Link to="/products" className="btn-secondary w-full justify-center text-body-sm">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
