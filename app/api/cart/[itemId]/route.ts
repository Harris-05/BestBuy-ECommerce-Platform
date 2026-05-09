import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-guard'

export async function PUT(req: NextRequest, { params }: { params: { itemId: string } }) {
  const authError = await requireAuth(req)
  if (authError) return authError

  const { quantity } = await req.json()
  if (quantity < 1) return Response.json({ error: 'Invalid quantity' }, { status: 400 })

  const item = await prisma.cartItem.update({ where: { id: params.itemId }, data: { quantity } })
  return Response.json(item)
}

export async function DELETE(req: NextRequest, { params }: { params: { itemId: string } }) {
  const authError = await requireAuth(req)
  if (authError) return authError

  await prisma.cartItem.delete({ where: { id: params.itemId } })
  return Response.json({ message: 'Item removed' })
}
