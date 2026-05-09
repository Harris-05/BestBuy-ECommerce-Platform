import { StatsCard } from '@/components/admin/StatsCard'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboardPage() {
  const [totalUsers, totalOrders, revenue, lowStock] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Revenue" value={`$${revenue._sum.total ?? 0}`} />
        <StatsCard title="Total Orders" value={totalOrders} />
        <StatsCard title="Total Users" value={totalUsers} />
        <StatsCard title="Low Stock Items" value={lowStock} />
      </div>
    </div>
  )
}
