export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price))
}

export function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export function getStockLabel(stock) {
  if (stock === 0) return { label: 'Out of Stock', color: 'text-red-500' }
  if (stock <= 5) return { label: 'Low Stock', color: 'text-amber-500' }
  return { label: 'In Stock', color: 'text-green-500' }
}

export function resolveImage(path) {
  if (!path || path === 'no-photo.jpg') return 'https://placehold.co/600x450?text=No+Image'
  if (path.startsWith('http')) return path
  if (path.startsWith('data:')) return path
  // Handle local server uploads
  return path.startsWith('/') ? path : `/uploads/${path}`
}
