'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, total } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-xl flex flex-col"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold text-lg">Cart ({items.length})</h2>
              <button onClick={onClose}><X size={20} /></button>
            </div>

            <ul className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 && <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>}
              {items.map(item => (
                <li key={item.id} className="flex gap-3">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 object-cover rounded" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-[#e94560]">${item.product.price} × {item.quantity}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-400"><X size={16} /></button>
                </li>
              ))}
            </ul>

            <div className="p-4 border-t space-y-3">
              <div className="flex justify-between font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
              <Link href="/checkout" onClick={onClose} className="block w-full text-center bg-[#e94560] text-white py-2 rounded">
                Checkout
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
