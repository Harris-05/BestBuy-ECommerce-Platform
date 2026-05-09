'use client'

import { useSession } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user ?? null,
    isAdmin: (session?.user as any)?.role === 'ADMIN',
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  }
}
