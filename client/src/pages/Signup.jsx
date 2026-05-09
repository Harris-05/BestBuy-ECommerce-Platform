import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Signup() {
  const navigate = useNavigate()
  const { register, status, error } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [formError, setFormError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return setFormError('Passwords do not match.')
    if (form.password.length < 8) return setFormError('Password must be at least 8 characters.')
    setFormError('')
    const result = await register({ name: form.name, email: form.email, password: form.password })
    if (!result.error) navigate('/')
  }

  const loading = status === 'loading'
  const displayError = formError || error

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface-section px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="font-headline text-2xl font-bold text-ink">
            bestbuy<span className="text-orange">Market</span>
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="font-headline font-bold text-headline-md text-ink mb-1">Create Account</h1>
          <p className="text-body-sm text-ink-muted mb-6">Join millions of shoppers on BestBuy.</p>

          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-body-sm px-4 py-3 rounded mb-4">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-label-md text-ink-muted block mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" required className="input" />
            </div>

            <div>
              <label className="text-label-md text-ink-muted block mb-1.5">Email address</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" required className="input" />
            </div>

            <div>
              <label className="text-label-md text-ink-muted block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="input pr-10"
                />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-label-md text-ink-muted block mb-1.5">Confirm Password</label>
              <input
                type={show ? 'text' : 'password'}
                value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
                placeholder="Re-enter password"
                required
                className="input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-body-md">
              {loading ? <><Loader2 size={17} className="animate-spin" />Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-body-sm text-ink-muted mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-navy font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-label-sm text-ink-faint mt-4">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="hover:underline">Terms</Link> and{' '}
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
