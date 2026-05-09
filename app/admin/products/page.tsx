import { prisma } from '@/lib/prisma'
import { DataTable } from '@/components/admin/DataTable'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-playfair text-3xl font-bold">Products</h1>
        <button className="bg-[#e94560] text-white px-4 py-2 rounded">+ Add Product</button>
      </div>
      <DataTable data={products} type="products" />
    </div>
  )
}
