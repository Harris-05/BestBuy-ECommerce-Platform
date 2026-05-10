import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Package, Settings, LogOut, LayoutDashboard, Clock, Truck, Star } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import StarRating from '../components/shop/StarRating'

const PIPELINE = ['Pending', 'Confirmed', 'Shipped', 'Delivered']

function OrderPipeline({ status }) {
  const step = PIPELINE.indexOf(status)
  return (
    <div className="flex items-center gap-0 w-full">
      {PIPELINE.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-label-sm font-bold border-2 transition-colors ${i <= step ? 'border-navy bg-navy text-white' : 'border-border bg-white text-ink-faint'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-label-sm whitespace-nowrap ${i <= step ? 'text-navy font-semibold' : 'text-ink-faint'}`}>{label}</span>
          </div>
          {i < PIPELINE.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 transition-colors ${i < step ? 'bg-navy' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function OrderCard({ order }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-headline font-semibold text-body-md text-ink">Order #{(order._id ?? order.id).slice(-8).toUpperCase()}</p>
          <p className="text-label-sm text-ink-faint">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span className={`badge ${order.status === 'Delivered' ? 'bg-green-600' : order.status === 'Shipped' ? 'bg-blue-600' : 'bg-navy'} text-white`}>
          {order.status}
        </span>
      </div>

      {/* Pipeline */}
      <OrderPipeline status={order.status ?? 'Pending'} />

      {/* Items preview */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {order.items?.slice(0, 4).map((item, i) => (
          <img key={i} src={item.product?.images?.[0] ?? 'https://placehold.co/48x48?text=?'} alt={item.product?.name ?? ''} className="w-12 h-12 object-cover rounded border border-border flex-shrink-0" />
        ))}
        {(order.items?.length ?? 0) > 4 && (
          <div className="w-12 h-12 rounded border border-border flex items-center justify-center text-label-sm text-ink-muted flex-shrink-0">
            +{order.items.length - 4}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="font-headline font-bold text-body-md text-ink">${Number(order.total).toFixed(2)}</span>
        <button onClick={() => setOpen(o => !o)} className="text-body-sm text-navy hover:underline">
          {open ? 'Hide details' : 'View details'}
        </button>
      </div>

      {open && (
        <div className="border-t border-border pt-4 space-y-2">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-body-sm">
              <img src={item.product?.images?.[0] ?? 'https://placehold.co/40x40?text=?'} alt="" className="w-10 h-10 object-cover rounded border border-border" />
              <div className="flex-1">
                <p className="text-ink font-medium">{item.product?.name ?? 'Product'}</p>
                <p className="text-ink-faint">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
              </div>
              <p className="font-medium text-ink">${(item.quantity * item.price).toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t border-border font-headline font-bold text-body-md">
            <span>Total</span><span>${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

const TABS = [
  { id: 'orders',   label: 'My Orders',      icon: Package },
  { id: 'profile',  label: 'Account',        icon: User },
  { id: 'settings', label: 'Settings',       icon: Settings },
]

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isSeller, logout } = useAuth()
  const [tab,    setTab]    = useState('orders')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    api.get('/orders/my').then(({ data }) => setOrders(data)).catch(() => {}).finally(() => setLoading(false))
  }, [isAuthenticated, navigate])

  const handleLogout = async () => { await logout(); navigate('/') }

  if (!user) return null

  return (
    <div className="container-content py-8">
      <div className="grid lg:grid-cols-4 gap-6">

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-headline font-bold text-headline-sm">
                {user.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div>
                <p className="font-headline font-semibold text-body-md text-ink">{user.name}</p>
                <p className="text-label-sm text-ink-faint">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm transition-colors ${tab === t.id ? 'bg-navy text-white' : 'text-ink-muted hover:bg-surface-section'}`}
                >
                  <t.icon size={16} />{t.label}
                </button>
              ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />Sign Out
                </button>
              </nav>

              {isSeller && (
                <div className="pt-4 border-t border-border">
                  <Link
                    to="/seller/dashboard"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-orange text-white font-semibold text-body-sm hover:bg-orange-hover transition-colors shadow-sm"
                  >
                    <LayoutDashboard size={16} />Seller Dashboard
                  </Link>
                </div>
              )}
            </div>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-5" id="orders">

          {tab === 'orders' && (
            <>
              <h2 className="font-headline font-bold text-headline-md text-ink">My Orders</h2>
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="card h-36 animate-pulse bg-surface-dim" />)}
                </div>
              ) : orders.length === 0 ? (
                <div className="card p-10 text-center">
                  <Package size={40} className="mx-auto text-ink-faint mb-3" />
                  <p className="font-headline font-semibold text-body-md text-ink">No orders yet</p>
                  <p className="text-body-sm text-ink-muted mb-4">When you place orders, they'll appear here.</p>
                  <Link to="/products" className="btn-primary">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(o => <OrderCard key={o._id ?? o.id} order={o} />)}
                </div>
              )}
            </>
          )}

          {tab === 'profile' && (
            <>
              <h2 className="font-headline font-bold text-headline-md text-ink">Account Information</h2>
              <div className="card p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-label-md text-ink-muted block mb-1.5">Full Name</label>
                    <input defaultValue={user.name} className="input" />
                  </div>
                  <div>
                    <label className="text-label-md text-ink-muted block mb-1.5">Email</label>
                    <input defaultValue={user.email} type="email" className="input" />
                  </div>
                  <div>
                    <label className="text-label-md text-ink-muted block mb-1.5">Role</label>
                    <input defaultValue={user.role} disabled className="input bg-surface-section capitalize" />
                  </div>
                </div>
                <button className="btn-primary">Save Changes</button>
              </div>
            </>
          )}

          {tab === 'settings' && (
            <>
              <h2 className="font-headline font-bold text-headline-md text-ink">Settings</h2>
              <div className="card p-6 space-y-5">
                <div>
                  <h3 className="font-headline font-semibold text-body-md text-ink mb-3">Change Password</h3>
                  <div className="space-y-3 max-w-sm">
                    <input type="password" placeholder="Current password" className="input" />
                    <input type="password" placeholder="New password"     className="input" />
                    <input type="password" placeholder="Confirm new password" className="input" />
                    <button className="btn-primary">Update Password</button>
                  </div>
                </div>
                <hr className="border-border" />
                <div>
                  <h3 className="font-headline font-semibold text-body-md text-red-600 mb-1">Danger Zone</h3>
                  <p className="text-body-sm text-ink-muted mb-3">Permanently delete your account and all associated data.</p>
                  <button className="text-body-sm text-red-500 border border-red-300 px-4 py-2 rounded hover:bg-red-50 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
