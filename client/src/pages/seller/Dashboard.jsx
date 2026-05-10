import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, ShoppingBag, DollarSign, Star, Plus, Pencil, Trash2, X, Loader2, BarChart3, Bell
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'
import StatsCard   from '../../components/admin/StatsCard'
import DataTable   from '../../components/admin/DataTable'
import ProductForm from '../../components/admin/ProductForm'

const STATUS_COLORS = {
  Pending:   'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped:   'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
}
const PIPELINE = ['Pending', 'Confirmed', 'Shipped', 'Delivered']
const TABS = ['Overview', 'Products', 'Orders', 'Reviews']

const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '')

export default function SellerDashboard() {
  const navigate = useNavigate()
  const { user, isSeller, status: authStatus } = useAuth()
  const [tab,       setTab]       = useState('Overview')
  const [products,  setProducts]  = useState([])
  const [orders,    setOrders]    = useState([])
  const [stats,     setStats]     = useState({ revenue: 0, orders: 0, products: 0, avgRating: 0 })
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [liveAlert, setLiveAlert] = useState(null) // new-order SSE notification
  const [replyText, setReplyText] = useState({})   // { reviewId: text }
  const [replying,  setReplying]  = useState(null) // currently submitting reply id

  const computeStats = useCallback((prods, ords) => {
    const revenue   = ords.reduce((s, o) => s + Number(o.total ?? 0), 0)
    const ratings   = prods.flatMap(p => p.reviews?.map(r => r.rating) ?? [])
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
    setStats({ revenue, orders: ords.length, products: prods.length, avgRating })
  }, [])

  // Initial data load
  useEffect(() => {
    if (authStatus === 'loading') return
    if (!isSeller) { navigate('/'); return }

    Promise.all([
      api.get('/products/mine').catch(() => ({ data: [] })),
      api.get('/orders/seller').catch(() => ({ data: [] })),
    ]).then(([p, o]) => {
      const prods = Array.isArray(p.data) ? p.data : []
      const ords  = Array.isArray(o.data) ? o.data : []
      setProducts(prods)
      setOrders(ords)
      computeStats(prods, ords)
    }).finally(() => setLoading(false))
  }, [isSeller, authStatus, navigate, computeStats])

  // SSE — live order notifications
  useEffect(() => {
    if (!isSeller || authStatus !== 'succeeded') return

    const es = new EventSource(`${API_BASE}/orders/seller/stream`, { withCredentials: true })

    es.addEventListener('new_order', (e) => {
      const incoming = JSON.parse(e.data)

      // Prepend to orders list and refresh stats
      setOrders(prev => {
        const updated = [incoming, ...prev]
        setStats(s => ({
          ...s,
          orders:  updated.length,
          revenue: updated.reduce((sum, o) => sum + Number(o.total ?? 0), 0),
        }))
        return updated
      })

      setLiveAlert(incoming)
      // Auto-dismiss alert after 8 seconds
      setTimeout(() => setLiveAlert(null), 8000)
    })

    es.addEventListener('error', () => {
      // Connection dropped — browser will retry automatically
    })

    return () => es.close()
  }, [isSeller, authStatus])

  const deleteProduct = async (row) => {
    if (!confirm(`Delete "${row.name}"?`)) return
    await api.delete(`/products/${row._id ?? row.id}`)
    setProducts(ps => ps.filter(p => (p._id ?? p.id) !== (row._id ?? row.id)))
  }

  const updateOrderStatus = async (orderId, status) => {
    await api.patch(`/orders/${orderId}/status`, { status })
    setOrders(os => os.map(o => (o._id ?? o.id) === orderId ? { ...o, status } : o))
  }
  
  const submitReply = async (productId, reviewId) => {
    const text = replyText[reviewId]
    if (!text?.trim()) return
    setReplying(reviewId)
    try {
      await api.patch(`/reviews/${reviewId}`, { productId, reply: text })
      // Update local state
      setProducts(ps => ps.map(p => {
        if ((p._id ?? p.id) !== productId) return p
        return {
          ...p,
          reviews: p.reviews.map(r => (r._id ?? r.id) === reviewId ? { ...r, reply: text } : r)
        }
      }))
      setReplyText(prev => ({ ...prev, [reviewId]: '' }))
    } catch (err) {
      alert('Failed to send reply')
    } finally {
      setReplying(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-ink-muted">
        <Loader2 size={22} className="animate-spin" />Loading dashboard…
      </div>
    )
  }

  return (
    <div className="container-content py-6 sm:py-8">
      {/* Live order alert banner */}
      {liveAlert && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 sm:max-w-sm w-auto bg-navy text-white rounded-xl shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right">
          <div className="w-9 h-9 rounded-full bg-orange/20 flex items-center justify-center shrink-0">
            <Bell size={18} className="text-orange" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-body-sm">New Order #{liveAlert.orderRef ?? liveAlert._id?.toString().slice(-8).toUpperCase()}!</p>
            <p className="text-label-sm text-white/70">{liveAlert.items?.length ?? 0} item(s) · ${Number(liveAlert.total ?? 0).toFixed(2)}</p>
          </div>
          <button onClick={() => setLiveAlert(null)} className="text-white/60 hover:text-white shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline font-bold text-headline-md sm:text-headline-lg text-ink">Seller Dashboard</h1>
          <p className="text-body-sm text-ink-muted">Welcome back, {user?.name}</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary w-full sm:w-auto gap-2 justify-center">
          <Plus size={16} />New Product
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-5 py-3 text-body-sm font-medium whitespace-nowrap transition-colors ${tab === t ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
          >
            {t}
            {t === 'Orders' && liveAlert && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-orange inline-block" />
            )}
            {tab === t && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overview */}
          {tab === 'Overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Total Revenue"   value={`$${stats.revenue.toFixed(2)}`}    icon={DollarSign} color="orange" />
                <StatsCard title="Total Orders"    value={stats.orders}                       icon={ShoppingBag} color="navy" />
                <StatsCard title="Active Products" value={stats.products}                     icon={Package}    color="green" />
                <StatsCard title="Avg. Rating"     value={`${stats.avgRating.toFixed(1)} ★`} icon={Star}       color="orange" trend={2} />
              </div>

              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={18} className="text-navy" />
                  <h3 className="font-headline font-semibold text-body-md text-ink">Recent Orders</h3>
                </div>
                {orders.length === 0 ? (
                  <p className="text-body-sm text-ink-muted text-center py-8">No orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map(o => (
                      <div key={o._id ?? o.id} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                        <div className="flex-1">
                          <p className="text-body-sm font-medium text-ink">#{(o._id ?? o.id).toString().slice(-8).toUpperCase()}</p>
                          <p className="text-label-sm text-ink-faint">{new Date(o.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-label-sm px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {o.status}
                        </span>
                        <span className="font-headline font-bold text-body-sm text-ink">${Number(o.total).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products */}
          {tab === 'Products' && (
            <DataTable
              data={products}
              columns={['name', 'category', 'price', 'stock', 'isActive']}
              onEdit={row => { setEditing(row); setShowForm(true) }}
              onDelete={deleteProduct}
            />
          )}

          {/* Orders */}
          {tab === 'Orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="card p-10 text-center text-ink-muted">
                  <ShoppingBag size={40} className="mx-auto mb-3 opacity-40" />
                  <p className="text-body-md">No orders received yet.</p>
                </div>
              ) : orders.map(o => (
                <div key={o._id ?? o.id} className="card p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-headline font-semibold text-body-md text-ink">
                        Order #{(o._id ?? o.id).toString().slice(-8).toUpperCase()}
                      </p>
                      <p className="text-label-sm text-ink-faint">{new Date(o.createdAt).toLocaleDateString()}</p>
                      {o.paymentMethod && (
                        <p className="text-label-sm text-ink-muted mt-0.5">
                          {o.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid via Card'}
                          {o.isPaid && <span className="ml-1 text-green-600">· Paid</span>}
                        </p>
                      )}
                    </div>
                    <span className="font-headline font-bold text-body-md text-ink">${Number(o.total).toFixed(2)}</span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {o.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-body-sm">
                        <img
                          src={item.product?.images?.[0] ?? item.image ?? 'https://placehold.co/40x40?text=?'}
                          alt=""
                          className="w-10 h-10 object-cover rounded border border-border"
                        />
                        <p className="flex-1 text-ink">{item.product?.name ?? item.name ?? 'Product'} × {item.quantity}</p>
                        <p className="text-ink font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Status control */}
                  <div className="flex items-center gap-3">
                    <label className="text-label-md text-ink-muted">Update Status:</label>
                    <select
                      value={o.status ?? 'Pending'}
                      onChange={e => updateOrderStatus(o._id ?? o.id, e.target.value)}
                      className="input py-1.5 text-body-sm w-auto"
                    >
                      {PIPELINE.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className={`text-label-sm px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews */}
          {tab === 'Reviews' && (
            <div className="space-y-4">
              {products.flatMap(p =>
                (p.reviews ?? []).map(r => ({ ...r, productName: p.name, productId: p._id ?? p.id }))
              ).length === 0 ? (
                <div className="card p-10 text-center text-ink-muted">
                  <Star size={40} className="mx-auto mb-3 opacity-40" />
                  <p className="text-body-md">No reviews yet.</p>
                </div>
              ) : products.flatMap(p =>
                (p.reviews ?? []).map(r => ({ ...r, productName: p.name, productId: p._id ?? p.id }))
              ).map((r, i) => (
                <div key={r._id ?? i} className="card p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-body-sm text-ink">{r.productName}</p>
                      <p className="text-label-sm text-ink-faint">By {r.name ?? 'Anonymous'}</p>
                    </div>
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`text-sm ${s <= r.rating ? 'text-orange' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-body-sm text-ink italic">"{r.comment}"</p>
                  
                  {r.reply ? (
                    <div className="pl-4 border-l-2 border-orange bg-orange-light/30 p-3 rounded-r-lg">
                      <p className="text-label-sm font-bold text-navy mb-1 uppercase tracking-wider">Your Official Reply</p>
                      <p className="text-body-sm text-ink-muted">{r.reply}</p>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <textarea
                        placeholder="Write a professional reply…"
                        value={replyText[r._id ?? i] ?? ''}
                        onChange={e => setReplyText(prev => ({ ...prev, [r._id ?? i]: e.target.value }))}
                        className="input text-body-sm min-h-[80px] mb-2"
                      />
                      <button
                        onClick={() => submitReply(r.productId, r._id ?? i)}
                        disabled={replying === (r._id ?? i) || !(replyText[r._id ?? i] ?? '').trim()}
                        className="btn-primary text-label-sm py-1.5 px-4 disabled:opacity-50"
                      >
                        {replying === (r._id ?? i) ? 'Sending…' : 'Send Reply'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-navy-deep/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-headline font-semibold text-headline-sm">{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded hover:bg-surface-section"><X size={18} /></button>
            </div>
            <div className="p-6">
              <ProductForm
                initial={editing}
                onSuccess={() => {
                  setShowForm(false)
                  api.get('/products/mine').then(({ data }) => setProducts(Array.isArray(data) ? data : []))
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
