import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-guard'

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req, 'ADMIN')
  if (authError) return authError

  const [totalUsers, totalOrders, revenue, lowStock, topProducts] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ])

  return Response.json({ totalUsers, totalOrders, revenue: revenue._sum.total, lowStock, topProducts })
}
