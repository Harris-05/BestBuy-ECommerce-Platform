'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

async function fetchCart() {
  const res = await fetch('/api/cart')
  if (!res.ok) return { items: [] }
  return res.json()
}

export function useCart() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: !!session,
  })

  const items: any[] = cart?.items ?? []
  const total = items.reduce((sum: number, item: any) => sum + Number(item.product.price) * item.quantity, 0)

  const addItem = async (productId: string, quantity = 1) => {
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
      headers: { 'Content-Type': 'application/json' },
    })
    queryClient.invalidateQueries({ queryKey: ['cart'] })
  }

  const removeItem = async (itemId: string) => {
    await fetch(`/api/cart/${itemId}`, { method: 'DELETE' })
    queryClient.invalidateQueries({ queryKey: ['cart'] })
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return removeItem(itemId)
    await fetch(`/api/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
      headers: { 'Content-Type': 'application/json' },
    })
    queryClient.invalidateQueries({ queryKey: ['cart'] })
  }

  return { items, total, addItem, removeItem, updateQuantity }
}
