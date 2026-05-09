import { prisma } from '@/lib/prisma'
import { DataTable } from '@/components/admin/DataTable'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl font-bold mb-8">Orders</h1>
      <DataTable data={orders} type="orders" />
    </div>
  )
}
