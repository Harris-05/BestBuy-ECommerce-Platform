import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } } },
  })

  if (!order || (order.userId !== session.user.id && session.user.role !== 'ADMIN')) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl font-bold mb-2">Order #{order.id.slice(-8).toUpperCase()}</h1>
      <p className="text-gray-500 mb-6">Status: <span className="font-medium text-[#e94560]">{order.status}</span></p>
      <ul className="space-y-4">
        {order.items.map(item => (
          <li key={item.id} className="flex gap-4 border p-4 rounded">
            <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price.toString()}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-right font-bold text-lg mt-6">Total: ${order.total.toString()}</p>
    </div>
  )
}
