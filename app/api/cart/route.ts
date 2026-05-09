import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-guard'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req)
  if (authError) return authError

  const token = await getToken({ req })
  const cart = await prisma.cart.findUnique({
    where: { userId: token!.id as string },
    include: { items: { include: { product: true } } },
  })

  return Response.json(cart ?? { items: [] })
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req)
  if (authError) return authError

  const token = await getToken({ req })
  const { productId, quantity = 1 } = await req.json()
  const userId = token!.id as string

  let cart = await prisma.cart.findUnique({ where: { userId } })
  if (!cart) cart = await prisma.cart.create({ data: { userId } })

  const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } })
  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } })
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } })
  }

  return Response.json({ message: 'Item added' })
}
