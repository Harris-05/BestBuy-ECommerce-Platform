import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-guard'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth(req)
  if (authError) return authError

  const token = await getToken({ req })
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } } },
  })

  if (!order) return Response.json({ error: 'Not found' }, { status: 404 })
  if (order.userId !== token!.id && token!.role !== 'ADMIN')
    return Response.json({ error: 'Forbidden' }, { status: 403 })

  return Response.json(order)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth(req, 'ADMIN')
  if (authError) return authError

  const { status } = await req.json()
  const order = await prisma.order.update({ where: { id: params.id }, data: { status } })
  return Response.json(order)
}
