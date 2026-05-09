import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '../shop/CartDrawer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-section">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
