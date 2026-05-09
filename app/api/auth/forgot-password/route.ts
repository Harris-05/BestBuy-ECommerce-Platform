import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/resend'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return Response.json({ message: 'If that email exists, a reset link was sent.' })

  const rawToken = crypto.randomBytes(32).toString('hex')
  const hashedToken = await bcrypt.hash(rawToken, 10)
  const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: hashedToken, resetTokenExp: expiry },
  })

  await sendPasswordResetEmail(email, rawToken)

  return Response.json({ message: 'If that email exists, a reset link was sent.' })
}
