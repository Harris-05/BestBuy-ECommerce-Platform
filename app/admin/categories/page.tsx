import { prisma } from '@/lib/prisma'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } } })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl font-bold mb-8">Categories</h1>
      <ul className="space-y-3">
        {categories.map(cat => (
          <li key={cat.id} className="flex justify-between items-center border p-4 rounded">
            <span className="font-medium">{cat.name}</span>
            <span className="text-gray-500 text-sm">{cat._count.products} products</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
