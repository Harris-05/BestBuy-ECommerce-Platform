import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-guard'
import { getToken } from 'next-auth/jwt'
import { z } from 'zod'

const reviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
})

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req)
  if (authError) return authError

  const token = await getToken({ req })
  const body = await req.json()
  const result = reviewSchema.safeParse(body)
  if (!result.success) return Response.json({ errors: result.error.flatten().fieldErrors }, { status: 400 })

  const review = await prisma.review.create({
    data: { ...result.data, userId: token!.id as string },
  })

  return Response.json(review, { status: 201 })
}
