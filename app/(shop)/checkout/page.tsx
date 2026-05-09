'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl font-bold mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex gap-4 mb-10 text-sm font-medium">
        {(['Details', 'Payment', 'Confirmation'] as const).map((label, i) => (
          <span key={label} className={`px-3 py-1 rounded-full ${step === i + 1 ? 'bg-[#e94560] text-white' : 'bg-gray-100 text-gray-500'}`}>
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-xl">Shipping Details</h2>
          <input className="w-full border p-2 rounded" placeholder="Full Name" />
          <input className="w-full border p-2 rounded" placeholder="Address Line 1" />
          <input className="w-full border p-2 rounded" placeholder="City" />
          <input className="w-full border p-2 rounded" placeholder="Postal Code" />
          <button onClick={() => setStep(2)} className="bg-[#e94560] text-white px-6 py-2 rounded">Continue to Payment</button>
        </div>
      )}

      {step === 2 && (
        <Elements stripe={stripePromise}>
          <div className="space-y-4">
            <h2 className="font-semibold text-xl">Payment</h2>
            {/* Stripe CardElement goes here */}
            <div className="border p-4 rounded">[Stripe Card Element]</div>
            <button onClick={() => setStep(3)} className="bg-[#e94560] text-white px-6 py-2 rounded">Place Order</button>
          </div>
        </Elements>
      )}

      {step === 3 && (
        <div className="text-center space-y-4">
          <h2 className="font-playfair text-2xl font-bold text-green-600">Order Placed!</h2>
          <p className="text-gray-600">Thank you for your purchase. Check your email for confirmation.</p>
          <a href="/account/orders" className="text-[#e94560] underline">View My Orders</a>
        </div>
      )}
    </div>
  )
}
