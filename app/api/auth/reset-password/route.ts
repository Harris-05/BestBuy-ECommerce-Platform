import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword } from '@/lib/auth-helpers'
import { resetPasswordSchema } from '@/lib/validations/auth'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = resetPasswordSchema.safeParse(body)
  if (!result.success) return Response.json({ errors: result.error.flatten().fieldErrors }, { status: 400 })

  const { token, password } = result.data

  const users = await prisma.user.findMany({
    where: { resetToken: { not: null }, resetTokenExp: { gt: new Date() } },
  })

  let matched = null
  for (const user of users) {
    if (user.resetToken && await verifyPassword(token, user.resetToken)) {
      matched = user
      break
    }
  }

  if (!matched) return Response.json({ error: 'Invalid or expired token' }, { status: 400 })

  await prisma.user.update({
    where: { id: matched.id },
    data: { passwordHash: await hashPassword(password), resetToken: null, resetTokenExp: null },
  })

  return Response.json({ message: 'Password reset successfully' })
}
