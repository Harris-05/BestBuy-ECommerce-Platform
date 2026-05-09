import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export default function SearchBar({ defaultValue = '', placeholder = 'Search products…' }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(defaultValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex rounded overflow-hidden border border-border focus-within:border-navy transition-colors bg-white">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2.5 text-body-sm text-ink focus:outline-none bg-transparent placeholder-ink-faint"
      />
      <button type="submit" className="px-4 bg-orange hover:bg-orange-hover transition-colors">
        <Search size={16} className="text-navy-deep" />
      </button>
    </form>
  )
}
