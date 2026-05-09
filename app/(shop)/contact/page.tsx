'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="font-playfair text-4xl font-bold mb-8">Contact Us</h1>
      {sent ? (
        <p className="text-green-600 text-lg">Thanks! We'll get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Your Name" required />
          <input type="email" className="w-full border p-2 rounded" placeholder="Email" required />
          <textarea className="w-full border p-2 rounded h-32 resize-none" placeholder="Your message" required />
          <button type="submit" className="bg-[#e94560] text-white px-6 py-2 rounded">Send Message</button>
        </form>
      )}
    </div>
  )
}
