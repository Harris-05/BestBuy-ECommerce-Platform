import { prisma } from '@/lib/prisma'
import { DataTable } from '@/components/admin/DataTable'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, _count: { select: { orders: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl font-bold mb-8">Users</h1>
      <DataTable data={users} type="users" />
    </div>
  )
}
