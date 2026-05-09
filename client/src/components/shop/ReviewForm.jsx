import { useState } from 'react'
import { Star } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

export default function ReviewForm({ productId, onSuccess }) {
  const { isAuthenticated } = useAuth()
  const [rating,  setRating]  = useState(0)
  const [hover,   setHover]   = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating)         return setError('Please select a rating.')
    if (!comment.trim()) return setError('Please write a comment.')
    setLoading(true); setError('')
    try {
      await api.post('/reviews', { productId, rating, comment })
      setDone(true)
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to submit review.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="card p-5 text-center text-ink-muted text-body-sm">
        Please{' '}
        <a href="/login" className="text-navy font-medium hover:underline">sign in</a>
        {' '}to write a review.
      </div>
    )
  }

  if (done) {
    return (
      <div className="card p-5 text-center text-green-700 text-body-sm font-medium">
        Thank you! Your review has been submitted.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-headline font-semibold text-headline-sm">Write a Review</h3>

      {/* Star selector */}
      <div>
        <label className="text-label-md text-ink-muted block mb-2">Your Rating</label>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(s => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(s)}
            >
              <Star
                size={24}
                className={(hover || rating) >= s
                  ? 'fill-orange text-orange'
                  : 'fill-none text-gray-300'}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="text-label-md text-ink-muted block mb-2">Your Review</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={4}
          placeholder="What did you like or dislike? What did you use this product for?"
          className="input resize-none"
        />
      </div>

      {error && <p className="text-body-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}
