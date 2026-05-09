'use client'

import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    })
    setSent(true)
  }

  if (sent) return <p className="text-center mt-20">Check your email for a reset link.</p>

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 space-y-4 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-[#e94560] text-white py-2 rounded">Send Reset Link</button>
      </form>
    </div>
  )
}
