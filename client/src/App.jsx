import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchMe } from './store/authSlice'
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
  useEffect(() => { dispatch(fetchMe()) }, [dispatch])

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
          </Routes>
        </Suspense>
      </Layout>
      <ChatBot />
    </Router>
  )
}
