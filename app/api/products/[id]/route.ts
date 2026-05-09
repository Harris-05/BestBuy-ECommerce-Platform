import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-guard'
import { productSchema } from '@/lib/validations/product'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true, reviews: { include: { user: { select: { name: true } } } } },
  })
  if (!product) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth(req, 'ADMIN')
  if (authError) return authError

  const body = await req.json()
  const result = productSchema.safeParse(body)
  if (!result.success) return Response.json({ errors: result.error.flatten().fieldErrors }, { status: 400 })

  const product = await prisma.product.update({ where: { id: params.id }, data: result.data })
  return Response.json(product)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth(req, 'ADMIN')
  if (authError) return authError

  await prisma.product.update({ where: { id: params.id }, data: { isActive: false } })
  return Response.json({ message: 'Product deactivated' })
}
