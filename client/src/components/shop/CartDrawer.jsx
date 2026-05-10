import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { resolveImage } from '../../lib/shop-utils'

export default function CartDrawer() {
  const { items, total, drawerOpen, closeDrawer, removeItem, updateQuantity } = useCart()

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-navy-deep/40 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />

          {/* Drawer panel */}
          <motion.aside
            className="fixed right-0 top-0 h-full w-full max-w-full sm:max-w-sm bg-white z-50 shadow-modal flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-navy" />
                <h2 className="font-headline font-semibold text-headline-sm text-ink">
                  Cart ({items.length})
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded hover:bg-surface-section transition-colors"
              >
                <X size={20} className="text-ink-muted" />
              </button>
            </div>

            {/* Items */}
            <ul className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 && (
                <li className="flex flex-col items-center justify-center h-full gap-4 text-ink-muted">
                  <ShoppingBag size={48} className="opacity-30" />
                  <p className="text-body-md">Your cart is empty.</p>
                  <button onClick={closeDrawer} className="btn-primary">
                    Start Shopping
                  </button>
                </li>
              )}
              {items.map(item => (
                <li key={item.productId} className="flex gap-3">
                  <img
                    src={resolveImage(item.image)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border border-border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-medium text-ink truncate">{item.name}</p>
                    <p className="text-body-sm text-orange font-semibold mt-0.5">
                      ${Number(item.price).toFixed(2)}
                    </p>
                    {/* Quantity */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-6 h-6 rounded border border-border flex items-center justify-center hover:border-navy transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-body-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-6 h-6 rounded border border-border flex items-center justify-center hover:border-navy transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="self-start p-1 rounded hover:bg-red-50 hover:text-red-500 text-ink-faint transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-border space-y-3 bg-surface-section">
                <div className="flex justify-between items-center">
                  <span className="text-body-md text-ink-muted">Subtotal</span>
                  <span className="font-headline font-bold text-headline-sm text-ink">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <p className="text-label-sm text-ink-faint">Shipping calculated at checkout</p>
                <Link
                  to="/checkout"
                  onClick={closeDrawer}
                  className="btn-primary w-full justify-center"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeDrawer}
                  className="btn-secondary w-full justify-center"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
