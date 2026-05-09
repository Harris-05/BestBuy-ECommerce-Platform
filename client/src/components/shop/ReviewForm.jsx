'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export function ReviewForm({ productId }: { productId: string }) {
  const { data: session } = useSession()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!session) return <p className="text-sm text-gray-500">Log in to leave a review.</p>
  if (submitted) return <p className="text-green-600 text-sm">Review submitted!</p>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId, rating, comment }),
      headers: { 'Content-Type': 'application/json' },
    })
    setSubmitted(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded">
      <h3 className="font-medium">Write a Review</h3>
      <div className="flex gap-2 items-center">
        <label className="text-sm">Rating:</label>
        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border p-1 rounded text-sm">
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} stars</option>)}
        </select>
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="w-full border p-2 rounded text-sm h-24 resize-none"
        placeholder="Share your thoughts..."
        required
      />
      <button type="submit" className="bg-[#e94560] text-white px-4 py-2 rounded text-sm">Submit Review</button>
    </form>
  )
}
