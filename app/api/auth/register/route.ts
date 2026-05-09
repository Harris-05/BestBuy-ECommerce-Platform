import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth-helpers'
import { signupSchema } from '@/lib/validations/auth'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = signupSchema.safeParse(body)

  if (!result.success)
    return Response.json({ errors: result.error.flatten().fieldErrors }, { status: 400 })

  const { name, email, password } = result.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return Response.json({ error: 'Email already registered' }, { status: 409 })

  const passwordHash = await hashPassword(password)
  await prisma.user.create({ data: { name, email, passwordHash } })

  return Response.json({ message: 'Account created' }, { status: 201 })
}
