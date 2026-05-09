import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-guard'
import { z } from 'zod'

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth(req, 'ADMIN')
  if (authError) return authError

  const body = await req.json()
  const result = patchSchema.safeParse(body)
  if (!result.success) return Response.json({ errors: result.error.flatten().fieldErrors }, { status: 400 })

  const user = await prisma.user.update({ where: { id: params.id }, data: result.data })
  return Response.json({ id: user.id, role: user.role, isActive: user.isActive })
}
