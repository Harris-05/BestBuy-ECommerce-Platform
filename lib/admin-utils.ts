import { prisma } from './prisma'

export async function getDashboardStats() {
  const [totalUsers, totalOrders, revenue, lowStock] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
  ])
  return { totalUsers, totalOrders, revenue: revenue._sum.total ?? 0, lowStock }
}
