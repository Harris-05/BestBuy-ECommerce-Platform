import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchMe, logoutUser } from './store/authSlice'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import ChatBot from './components/ai/ChatBot'

const Home          = lazy(() => import('./pages/Home'))
const Products      = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart          = lazy(() => import('./pages/Cart'))
const Checkout      = lazy(() => import('./pages/Checkout'))
const Login         = lazy(() => import('./pages/Login'))
const Signup        = lazy(() => import('./pages/Signup'))
const Profile       = lazy(() => import('./pages/Profile'))
const SellerDash    = lazy(() => import('./pages/seller/Dashboard'))
const AdminDash     = lazy(() => import('./pages/admin/Dashboard'))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'))
const ResetPassword  = lazy(() => import('./pages/Auth/ResetPassword'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-orange animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useAuth()

  useEffect(() => { dispatch(fetchMe()) }, [dispatch])

  // Requirement 22: Inactivity Timeout (15 minutes)
  useEffect(() => {
    if (!isAuthenticated) return

    let timeout
    const resetTimer = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        dispatch(logoutUser())
        alert('Your session has expired due to inactivity.')
      }, 15 * 60 * 1000)
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(e => document.addEventListener(e, resetTimer))
    resetTimer()

    return () => {
      events.forEach(e => document.removeEventListener(e, resetTimer))
      clearTimeout(timeout)
    }
  }, [isAuthenticated, dispatch])

  return (
    <Router>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"                   element={<Home />} />
            <Route path="/products"           element={<Products />} />
            <Route path="/products/:slug"     element={<ProductDetail />} />
            <Route path="/cart"               element={<Cart />} />
            <Route path="/checkout"           element={<Checkout />} />
            <Route path="/login"              element={<Login />} />
            <Route path="/signup"             element={<Signup />} />
            <Route path="/profile"            element={<Profile />} />
            <Route path="/seller/dashboard"   element={<SellerDash />} />
            <Route path="/admin/dashboard"    element={<AdminDash />} />
            <Route path="/forgot-password"    element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
          </Routes>
        </Suspense>
      </Layout>
      <ChatBot />
    </Router>
  )
}
