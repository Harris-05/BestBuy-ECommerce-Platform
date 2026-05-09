import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CreditCard, Truck, CheckCircle2, Loader2, Lock } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

const STEPS = ['Shipping', 'Payment', 'Review']

export default function Checkout() {
  const navigate  = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { items, total, clearCart } = useCart()
  const [step,    setStep]    = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const [shipping, setShipping] = useState({
    name:    user?.name ?? '',
    email:   user?.email ?? '',
    phone:   '',
    address: '',
    city:    '',
    country: 'Pakistan',
    zip:     '',
  })
  const [payment, setPayment] = useState({ method: 'cod', cardNumber: '', expiry: '', cvv: '' })

  if (!items.length && !orderId) {
    return (
      <div className="container-content py-20 text-center">
        <p className="text-body-md text-ink-muted mb-4">No items in cart.</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    )
  }

  if (orderId) {
    return (
      <div className="container-content py-20 flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h2 className="font-headline font-bold text-headline-lg text-ink">Order Placed!</h2>
        <p className="text-body-md text-ink-muted max-w-sm">
          Your order <strong>#{orderId}</strong> has been placed and is being processed. You'll receive a confirmation email shortly.
        </p>
        <div className="flex gap-3">
          <Link to="/profile#orders" className="btn-primary">Track Order</Link>
          <Link to="/products"       className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const { data } = await api.post('/orders', {
        items: items.map(i => ({ product: i.productId, quantity: i.quantity, price: i.price })),
        total,
        shippingAddress: shipping,
        paymentMethod: payment.method,
      })
      clearCart()
      setOrderId(data._id ?? data.id ?? 'GM-' + Date.now())
    } catch (err) {
      alert(err.response?.data?.message ?? 'Failed to place order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-content py-8">
      {/* Progress steps */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-label-md transition-colors ${i <= step ? 'bg-navy text-white' : 'bg-surface-section text-ink-muted'}`}>
              <span className={`w-5 h-5 rounded-full text-label-sm flex items-center justify-center ${i < step ? 'bg-green-500' : i === step ? 'bg-orange text-navy-deep' : 'bg-white/20'}`}>
                {i < step ? '✓' : i + 1}
              </span>
              {s}
            </div>
            {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-navy' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Form area */}
        <div className="lg:col-span-2">

          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="card p-6 space-y-5">
              <h2 className="font-headline font-semibold text-headline-sm flex items-center gap-2">
                <Truck size={20} className="text-navy" />Shipping Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name',    key: 'name',    type: 'text',  span: true },
                  { label: 'Email',        key: 'email',   type: 'email', span: true },
                  { label: 'Phone',        key: 'phone',   type: 'tel',   span: false },
                  { label: 'ZIP Code',     key: 'zip',     type: 'text',  span: false },
                  { label: 'Street Address', key: 'address', type: 'text', span: true },
                  { label: 'City',         key: 'city',    type: 'text',  span: false },
                  { label: 'Country',      key: 'country', type: 'text',  span: false },
                ].map(f => (
                  <div key={f.key} className={f.span ? 'sm:col-span-2' : ''}>
                    <label className="text-label-md text-ink-muted block mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      value={shipping[f.key]}
                      onChange={e => setShipping(s => ({ ...s, [f.key]: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="btn-primary">Continue to Payment</button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="card p-6 space-y-5">
              <h2 className="font-headline font-semibold text-headline-sm flex items-center gap-2">
                <CreditCard size={20} className="text-navy" />Payment Method
              </h2>

              <div className="space-y-3">
                {/* COD */}
                <label className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${payment.method === 'cod' ? 'border-navy bg-surface-section' : 'border-border hover:border-navy/40'}`}>
                  <input type="radio" name="method" value="cod" checked={payment.method === 'cod'} onChange={() => setPayment(p => ({ ...p, method: 'cod' }))} className="mt-1" />
                  <div>
                    <p className="font-medium text-body-md text-ink">Cash on Delivery</p>
                    <p className="text-body-sm text-ink-muted">Pay when you receive your order.</p>
                  </div>
                </label>

                {/* Card */}
                <label className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${payment.method === 'card' ? 'border-navy bg-surface-section' : 'border-border hover:border-navy/40'}`}>
                  <input type="radio" name="method" value="card" checked={payment.method === 'card'} onChange={() => setPayment(p => ({ ...p, method: 'card' }))} className="mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-body-md text-ink flex items-center gap-2"><CreditCard size={16} />Credit / Debit Card</p>
                    <p className="text-body-sm text-ink-muted mb-3">Securely pay with Stripe.</p>
                    {payment.method === 'card' && (
                      <div className="space-y-3">
                        <input value={payment.cardNumber} onChange={e => setPayment(p => ({ ...p, cardNumber: e.target.value }))} placeholder="1234 5678 9012 3456" className="input text-body-sm" />
                        <div className="grid grid-cols-2 gap-3">
                          <input value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} placeholder="MM / YY" className="input text-body-sm" />
                          <input value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} placeholder="CVV" className="input text-body-sm" />
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-secondary">Back</button>
                <button onClick={() => setStep(2)} className="btn-primary flex-1">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="card p-6 space-y-5">
              <h2 className="font-headline font-semibold text-headline-sm">Review Your Order</h2>

              <div className="space-y-2 text-body-sm">
                <h4 className="font-semibold text-ink">Shipping to</h4>
                <p className="text-ink-muted">{shipping.name} · {shipping.phone}</p>
                <p className="text-ink-muted">{shipping.address}, {shipping.city}, {shipping.country} {shipping.zip}</p>
              </div>

              <div className="space-y-2 text-body-sm">
                <h4 className="font-semibold text-ink">Payment</h4>
                <p className="text-ink-muted capitalize">{payment.method === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</p>
              </div>

              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <img src={item.image ?? 'https://placehold.co/48x48?text=?'} alt={item.name} className="w-12 h-12 object-cover rounded border border-border" />
                    <div className="flex-1">
                      <p className="text-body-sm text-ink line-clamp-1">{item.name}</p>
                      <p className="text-label-sm text-ink-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-body-sm font-medium text-ink">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? <><Loader2 size={16} className="animate-spin" />Placing…</> : <><Lock size={16} />Place Order</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div>
          <div className="card p-5 sticky top-24 space-y-4">
            <h3 className="font-headline font-semibold text-headline-sm text-ink">Order Summary</h3>
            <div className="space-y-2 text-body-sm">
              <div className="flex justify-between text-ink-muted"><span>Items ({items.length})</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between text-ink-muted"><span>Shipping</span><span className="text-green-600">FREE</span></div>
              <hr className="border-border" />
              <div className="flex justify-between font-headline font-bold text-body-md text-ink">
                <span>Order Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-label-sm text-ink-faint">
              <Lock size={12} />SSL Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
