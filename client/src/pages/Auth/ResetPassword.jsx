import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) return setError('Passwords do not match.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')

    setLoading(true)
    setError('')
    try {
      await api.put(`/auth/resetpassword/${token}`, { password })
      alert('Password reset successful! Please login with your new password.')
      navigate('/login')
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
          <h1 className="font-headline font-bold text-headline-md text-ink mb-1">Set New Password</h1>
          <p className="text-body-sm text-ink-muted mb-6">Create a strong password for your account.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-body-sm px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-label-md text-ink-muted block mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="input px-10"
                />
                <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-label-md text-ink-muted block mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="input pl-10"
                />
                <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <><Loader2 size={17} className="animate-spin mr-2" />Resetting...</> : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
