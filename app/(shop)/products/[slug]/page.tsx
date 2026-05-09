import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ReviewForm } from '@/components/shop/ReviewForm'
import { StarRating } from '@/components/shop/StarRating'
import { ProductGrid } from '@/components/shop/ProductGrid'

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, reviews: { include: { user: { select: { name: true } } } } },
  })

  if (!product) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image gallery */}
        <div className="space-y-4">
          <img src={product.images[0]} alt={product.name} className="w-full rounded-lg" />
          <div className="flex gap-2">
            {product.images.slice(1).map((img, i) => (
              <img key={i} src={img} alt="" className="w-20 h-20 object-cover rounded cursor-pointer" />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{product.category.name}</p>
          <h1 className="font-playfair text-3xl font-bold">{product.name}</h1>
          <StarRating rating={0} />
          <p className="text-2xl font-bold text-[#e94560]">${product.price.toString()}</p>
          <p className="text-gray-600">{product.description}</p>
          <button className="w-full bg-[#e94560] text-white py-3 rounded font-medium">Add to Cart</button>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="font-playfair text-2xl font-bold mb-6">Reviews</h2>
        <ReviewForm productId={product.id} />
        <div className="mt-6 space-y-4">
          {product.reviews.map(r => (
            <div key={r.id} className="border p-4 rounded">
              <p className="font-medium">{r.user.name}</p>
              <StarRating rating={r.rating} />
              <p className="text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="font-playfair text-2xl font-bold mb-6">Related Products</h2>
        <ProductGrid searchParams={{ category: product.category.name }} />
      </section>
    </div>
  )
}
