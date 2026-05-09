export function formatPrice(price: number | string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(price))
}

export function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export function getStockLabel(stock: number): { label: string; color: string } {
  if (stock === 0) return { label: 'Out of Stock', color: 'text-red-500' }
  if (stock <= 5) return { label: 'Low Stock', color: 'text-amber-500' }
  return { label: 'In Stock', color: 'text-green-500' }
}
