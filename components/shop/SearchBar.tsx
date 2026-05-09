'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useEffect, useState } from 'react'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const debounced = useDebounce(value, 300)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debounced) params.set('q', debounced)
    else params.delete('q')
    router.push(`/products?${params.toString()}`)
  }, [debounced])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search products..."
        className="w-full pl-9 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560]"
      />
    </div>
  )
}
