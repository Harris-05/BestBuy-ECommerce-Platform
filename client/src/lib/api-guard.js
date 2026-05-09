import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function requireAuth(req: NextRequest, role?: 'ADMIN') {
  const token = await getToken({ req })
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (role && token.role !== role) return Response.json({ error: 'Forbidden' }, { status: 403 })
  return null
}
