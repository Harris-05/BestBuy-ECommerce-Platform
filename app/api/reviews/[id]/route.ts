import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-guard'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth(req, 'ADMIN')
  if (authError) return authError

  await prisma.review.delete({ where: { id: params.id } })
  return Response.json({ message: 'Review deleted' })
}
