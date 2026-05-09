import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, status, error } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)

  const from = location.state?.from?.pathname ?? '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form)
    if (!result.error) navigate(from, { replace: true })
  }

  const loading = status === 'loading'

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface-section px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="font-headline text-2xl font-bold text-ink">
            bestbuy<span className="text-orange">Market</span>
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="font-headline font-bold text-headline-md text-ink mb-1">Sign In</h1>
          <p className="text-body-sm text-ink-muted mb-6">Welcome back! Enter your details to continue.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-body-sm px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-label-md text-ink-muted block mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                required
                className="input"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-label-md text-ink-muted">Password</label>
                <Link to="/forgot-password" className="text-label-sm text-navy hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-body-md">
              {loading ? <><Loader2 size={17} className="animate-spin" />Signing in…</> : 'Sign In'}
            </button>
          </form>

          <div className="relative my-5">
            <hr className="border-border" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-label-sm text-ink-faint">or</span>
          </div>

          <p className="text-center text-body-sm text-ink-muted">
            New to BestBuy?{' '}
            <Link to="/signup" className="text-navy font-medium hover:underline">Create an account</Link>
          </p>
        </div>

        <p className="text-center text-label-sm text-ink-faint mt-4">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="hover:underline">Terms</Link> and{' '}
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
