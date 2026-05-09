import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, Loader2, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'
import StatsCard from '../../components/admin/StatsCard'
import DataTable from '../../components/admin/DataTable'

const TABS = ['Overview', 'Users', 'Products', 'Orders']

const ROLE_COLORS = {
  admin:  'bg-red-100 text-red-800',
  seller: 'bg-blue-100 text-blue-800',
  user:   'bg-gray-100 text-gray-700',
}

export default function AdminDashboard() {
  const navigate  = useNavigate()
  const { user, isAdmin, status: authStatus } = useAuth()
  const [tab,      setTab]      = useState('Overview')
  const [users,    setUsers]    = useState([])
  const [products, setProducts] = useState([])
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [stats,    setStats]    = useState({})

  useEffect(() => {
    if (authStatus === 'loading') return
    if (!isAdmin) { navigate('/'); return }
    Promise.all([
      api.get('/admin/users').catch(() => ({ data: [] })),
      api.get('/products?limit=100').catch(() => ({ data: [] })),
      api.get('/admin/orders').catch(() => ({ data: [] })),
    ]).then(([u, p, o]) => {
      const usersArr    = Array.isArray(u.data) ? u.data : u.data.users ?? []
      const productsArr = Array.isArray(p.data) ? p.data : p.data.products ?? []
      const ordersArr   = Array.isArray(o.data) ? o.data : o.data.orders ?? []

      setUsers(usersArr)
      setProducts(productsArr)
      setOrders(ordersArr)
      setStats({
        users:    usersArr.length,
        products: productsArr.length,
        orders:   ordersArr.length,
        revenue:  ordersArr.reduce((s, ord) => s + Number(ord.total ?? 0), 0),
        sellers:  usersArr.filter(u => u.role === 'seller').length,
      })
    }).finally(() => setLoading(false))
  }, [isAdmin, authStatus, navigate])

  const promoteToSeller = async (row) => {
    if (!confirm(`Promote ${row.name} to Seller?`)) return
    await api.patch(`/admin/users/${row._id ?? row.id}/role`, { role: 'seller' })
    setUsers(us => us.map(u => (u._id ?? u.id) === (row._id ?? row.id) ? { ...u, role: 'seller' } : u))
  }

  const deleteUser = async (row) => {
    if (!confirm(`Delete user ${row.name}?`)) return
    await api.delete(`/admin/users/${row._id ?? row.id}`)
    setUsers(us => us.filter(u => (u._id ?? u.id) !== (row._id ?? row.id)))
  }

  const deleteProduct = async (row) => {
    if (!confirm(`Delete product "${row.name}"?`)) return
    await api.delete(`/products/${row._id ?? row.id}`)
    setProducts(ps => ps.filter(p => (p._id ?? p.id) !== (row._id ?? row.id)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-ink-muted">
        <Loader2 size={22} className="animate-spin" />Loading admin dashboard…
      </div>
    )
  }

  return (
    <div className="container-content py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-navy text-white">
          <Shield size={22} />
        </div>
        <div>
          <h1 className="font-headline font-bold text-headline-lg text-ink">Admin Dashboard</h1>
          <p className="text-body-sm text-ink-muted">Logged in as {user?.name} · Full admin access</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-body-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === t ? 'border-orange text-ink' : 'border-transparent text-ink-muted hover:text-ink'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Revenue"  value={`$${(stats.revenue ?? 0).toFixed(2)}`}  icon={DollarSign} color="orange" trend={12} />
            <StatsCard title="Total Users"    value={stats.users ?? 0}                        icon={Users}      color="navy"   trend={5} />
            <StatsCard title="Total Products" value={stats.products ?? 0}                     icon={Package}    color="green"  trend={8} />
            <StatsCard title="Total Orders"   value={stats.orders ?? 0}                       icon={ShoppingBag} color="navy"  trend={3} />
          </div>

          {/* Quick stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-5">
              <p className="text-label-md text-ink-muted uppercase tracking-wide">Active Sellers</p>
              <p className="font-headline font-bold text-headline-md text-ink mt-1">{stats.sellers ?? 0}</p>
            </div>
            <div className="card p-5">
              <p className="text-label-md text-ink-muted uppercase tracking-wide">Avg Order Value</p>
              <p className="font-headline font-bold text-headline-md text-ink mt-1">
                ${stats.orders ? ((stats.revenue ?? 0) / stats.orders).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-label-md text-ink-muted uppercase tracking-wide">Conversion Rate</p>
              <p className="font-headline font-bold text-headline-md text-ink mt-1">
                {stats.users ? ((stats.orders / stats.users) * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
          </div>

          {/* Recent activity */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-navy" />
              <h3 className="font-headline font-semibold text-body-md text-ink">Recent Orders</h3>
            </div>
            <DataTable
              data={orders.slice(0, 10)}
              columns={['_id', 'total', 'status', 'paymentMethod', 'createdAt']}
            />
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'Users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-semibold text-headline-sm text-ink">All Users ({users.length})</h2>
          </div>
          <DataTable
            data={users}
            columns={['name', 'email', 'role', 'createdAt']}
            onEdit={promoteToSeller}
            onDelete={deleteUser}
          />
        </div>
      )}

      {/* Products */}
      {tab === 'Products' && (
        <div className="space-y-4">
          <h2 className="font-headline font-semibold text-headline-sm text-ink">All Products ({products.length})</h2>
          <DataTable
            data={products}
            columns={['name', 'category', 'price', 'stock', 'seller']}
            onDelete={deleteProduct}
          />
        </div>
      )}

      {/* Orders */}
      {tab === 'Orders' && (
        <div className="space-y-4">
          <h2 className="font-headline font-semibold text-headline-sm text-ink">All Orders ({orders.length})</h2>
          <DataTable
            data={orders}
            columns={['_id', 'user', 'total', 'status', 'paymentMethod', 'createdAt']}
          />
        </div>
      )}
    </div>
  )
}
