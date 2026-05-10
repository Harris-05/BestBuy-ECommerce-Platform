import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      await api.post('/auth/forgotpassword', { email })
      setMessage('Password reset email sent. Please check your inbox.')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-surface-section px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="card p-6 sm:p-8">
          <Link to="/login" className="inline-flex items-center text-label-sm text-ink-muted hover:text-navy mb-6 transition-colors">
            <ArrowLeft size={14} className="mr-1" /> Back to Login
          </Link>
          
          <h1 className="font-headline font-bold text-headline-md text-ink mb-1">Forgot Password</h1>
          <p className="text-body-sm text-ink-muted mb-6">Enter your email and we'll send you a link to reset your password.</p>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-body-sm px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-body-sm px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-label-md text-ink-muted block mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input pl-10"
                />
                <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <><Loader2 size={17} className="animate-spin mr-2" />Sending...</> : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
