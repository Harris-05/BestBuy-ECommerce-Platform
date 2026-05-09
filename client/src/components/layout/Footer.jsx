import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react'

const FOOTER_COLS = [
  {
    title: 'Get to Know Us',
    links: [
      { label: 'About BestBuy', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press Releases', to: '/press' },
      { label: 'Investor Relations', to: '/investors' },
    ],
  },
  {
    title: 'Make Money with Us',
    links: [
      { label: 'Sell on BestBuy', to: '/seller/register' },
      { label: 'Become an Affiliate', to: '/affiliate' },
      { label: 'Advertise Your Products', to: '/advertise' },
    ],
  },
  {
    title: 'Let Us Help You',
    links: [
      { label: 'Your Account', to: '/profile' },
      { label: 'Your Orders', to: '/profile#orders' },
      { label: 'Shipping Rates', to: '/shipping' },
      { label: 'Returns & Replacements', to: '/returns' },
      { label: 'Help', to: '/help' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-auto">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-navy-light py-3 text-center text-body-sm hover:bg-navy-deep transition-colors"
      >
        Back to top
      </button>

      {/* Main footer grid */}
      <div className="container-content py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FOOTER_COLS.map(col => (
            <div key={col.title}>
              <h4 className="font-headline font-semibold text-body-md mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-body-sm text-gray-300 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Social */}
          <div>
            <h4 className="font-headline font-semibold text-body-md mb-4">Connect With Us</h4>
            <div className="flex gap-3 mb-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-navy-light hover:bg-orange hover:text-navy-deep transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <ul className="space-y-2 text-body-sm text-gray-300">
              <li className="flex items-center gap-2"><Mail size={14} />support@BestBuy.com</li>
              <li className="flex items-center gap-2"><Phone size={14} />+92 300 0000000</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-navy-deep py-4">
        <div className="container-content flex flex-col sm:flex-row justify-between items-center gap-2 text-label-sm text-gray-400">
          <p>© {new Date().getFullYear()} BestBuy. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
