import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CreditCard, Truck, CheckCircle2, Loader2, Lock } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

const STEPS = ['Shipping', 'Payment', 'Review']

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '15px',
      color: '#1a1a2e',
      fontFamily: 'inherit',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
}

// Initialise Stripe once (returns null if key is not set — card option will be disabled)
function useStripePromise() {
  return useMemo(() => {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    return key ? loadStripe(key) : null
  }, [])
}

function CheckoutContent() {
  const navigate   = useNavigate()
  const { user }   = useAuth()
  const { items, total, clearCart } = useCart()
  const stripe     = useStripe()
  const elements   = useElements()
  const stripeReady = !!stripe && !!elements

  const [step,    setStep]    = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [cardError, setCardError] = useState('')

  const [shipping, setShipping] = useState({
    name:    user?.name ?? '',
    email:   user?.email ?? '',
    phone:   '',
    address: '',
    city:    '',
    country: 'Pakistan',
    zip:     '',
  })
  const [paymentMethod, setPaymentMethod] = useState('COD')

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
          Your order <strong>#{String(orderId).slice(-8).toUpperCase()}</strong> has been placed and is
          being processed. You'll receive a confirmation email shortly.
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
    setCardError('')
    try {
      const orderPayload = {
        items: items.map(i => ({ product: i.productId, quantity: i.quantity })),
        shippingAddress: shipping,
        paymentMethod,
      }

      if (paymentMethod === 'Stripe') {
        if (!stripeReady) throw new Error('Stripe is not available. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.')

        // 1. Create payment intent on the server
        const { data: piData } = await api.post('/orders/payment-intent', {
          amount: Math.round(total * 100), // convert dollars → cents
        })

        // 2. Confirm the card payment via Stripe Elements
        const { error, paymentIntent } = await stripe.confirmCardPayment(piData.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name:  shipping.name,
              email: shipping.email,
              phone: shipping.phone || undefined,
              address: {
                line1:       shipping.address,
                city:        shipping.city,
                country:     shipping.country,
                postal_code: shipping.zip,
              },
            },
          },
        })

        if (error) {
          setCardError(error.message)
          setLoading(false)
          return
        }

        orderPayload.paymentIntentId = paymentIntent.id
      }

      // 3. Save order in database
      const { data } = await api.post('/orders', orderPayload)
      clearCart()
      setOrderId(data.order?._id ?? data.order?.id ?? data._id ?? 'DEMO-' + Date.now())
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Failed to place order.'
      if (paymentMethod === 'Stripe') setCardError(msg)
      else alert(msg)
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
        <div className="lg:col-span-2">

          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="card p-6 space-y-5">
              <h2 className="font-headline font-semibold text-headline-sm flex items-center gap-2">
                <Truck size={20} className="text-navy" />Shipping Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name',       key: 'name',    type: 'text',  span: true  },
                  { label: 'Email',           key: 'email',   type: 'email', span: true  },
                  { label: 'Phone',           key: 'phone',   type: 'tel',   span: false },
                  { label: 'ZIP Code',        key: 'zip',     type: 'text',  span: false },
                  { label: 'Street Address',  key: 'address', type: 'text',  span: true  },
                  { label: 'City',            key: 'city',    type: 'text',  span: false },
                  { label: 'Country',         key: 'country', type: 'text',  span: false },
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
                <label className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-navy bg-surface-section' : 'border-border hover:border-navy/40'}`}>
                  <input
                    type="radio"
                    name="method"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => { setPaymentMethod('COD'); setCardError('') }}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-body-md text-ink">Cash on Delivery</p>
                    <p className="text-body-sm text-ink-muted">Pay when you receive your order.</p>
                  </div>
                </label>

                {/* Card via Stripe */}
                <label className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === 'Stripe' ? 'border-navy bg-surface-section' : 'border-border hover:border-navy/40'} ${!stripeReady ? 'opacity-60' : ''}`}>
                  <input
                    type="radio"
                    name="method"
                    value="Stripe"
                    checked={paymentMethod === 'Stripe'}
                    onChange={() => { setPaymentMethod('Stripe'); setCardError('') }}
                    className="mt-1"
                    disabled={!stripeReady}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-body-md text-ink flex items-center gap-2">
                      <CreditCard size={16} />Credit / Debit Card
                      {!stripeReady && <span className="text-label-sm text-ink-faint ml-2">(not configured)</span>}
                    </p>
                    <p className="text-body-sm text-ink-muted mb-3">Securely pay with Stripe.</p>

                    {paymentMethod === 'Stripe' && stripeReady && (
                      <div className="space-y-2">
                        <div className="input p-3">
                          <CardElement options={CARD_ELEMENT_OPTIONS} onChange={() => setCardError('')} />
                        </div>
                        {cardError && (
                          <p className="text-red-500 text-label-sm">{cardError}</p>
                        )}
                        <p className="text-label-sm text-ink-faint flex items-center gap-1">
                          <Lock size={11} />Your card details are encrypted by Stripe and never touch our servers.
                        </p>
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

              <div className="space-y-1 text-body-sm">
                <h4 className="font-semibold text-ink">Shipping to</h4>
                <p className="text-ink-muted">{shipping.name} · {shipping.phone}</p>
                <p className="text-ink-muted">{shipping.address}, {shipping.city}, {shipping.country} {shipping.zip}</p>
              </div>

              <div className="space-y-1 text-body-sm">
                <h4 className="font-semibold text-ink">Payment</h4>
                <p className="text-ink-muted">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Credit / Debit Card (Stripe)'}</p>
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

              {cardError && (
                <p className="text-red-500 text-label-sm bg-red-50 border border-red-200 rounded px-3 py-2">{cardError}</p>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading
                    ? <><Loader2 size={16} className="animate-spin" />Processing…</>
                    : <><Lock size={16} />{paymentMethod === 'Stripe' ? 'Pay & Place Order' : 'Place Order'}</>
                  }
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
              <div className="flex justify-between text-ink-muted">
                <span>Items ({items.length})</span><span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Shipping</span><span className="text-green-600">FREE</span>
              </div>
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

export default function Checkout() {
  const stripePromise = useStripePromise()
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  )
}
