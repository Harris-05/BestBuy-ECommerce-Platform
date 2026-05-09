import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-guard'
import { getToken } from 'next-auth/jwt'
import { stripe } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req)
  if (authError) return authError

  const token = await getToken({ req })
  const orders = await prisma.order.findMany({
    where: { userId: token!.id as string },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(orders)
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req)
  if (authError) return authError

  const token = await getToken({ req })
  const userId = token!.id as string
  const { address } = await req.json()

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  })

  if (!cart || cart.items.length === 0)
    return Response.json({ error: 'Cart is empty' }, { status: 400 })

  const total = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: 'usd',
  })

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      stripeId: paymentIntent.id,
      address,
      items: {
        create: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  })

  return Response.json({ orderId: order.id, clientSecret: paymentIntent.client_secret }, { status: 201 })
}
