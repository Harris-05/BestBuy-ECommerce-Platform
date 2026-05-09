'use client'

import { useCart } from '@/hooks/useCart'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-xl text-gray-500">Your cart is empty.</p>
        <a href="/products" className="bg-[#e94560] text-white px-6 py-2 rounded">Shop Now</a>
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl font-bold mb-8">Your Cart</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <ul className="flex-1 space-y-4">
          {items.map(item => (
            <li key={item.id} className="flex gap-4 border p-4 rounded">
              <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-[#e94560]">${item.product.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 border rounded">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 border rounded">+</button>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm">Remove</button>
            </li>
          ))}
        </ul>

        <aside className="w-full md:w-72 border p-6 rounded h-fit space-y-3">
          <h2 className="font-bold text-lg">Order Summary</h2>
          <div className="flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
          <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <a href="/checkout" className="block w-full text-center bg-[#e94560] text-white py-2 rounded">Proceed to Checkout</a>
        </aside>
      </div>
    </div>
  )
}
