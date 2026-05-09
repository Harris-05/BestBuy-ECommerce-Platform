import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-guard'
import { productSchema } from '@/lib/validations/product'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? ''
  const minPrice = parseFloat(searchParams.get('minPrice') ?? '0')
  const maxPrice = parseFloat(searchParams.get('maxPrice') ?? '999999')
  const sort = searchParams.get('sort') ?? 'newest'
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')

  const orderBy: Record<string, string> = {
    price_asc: 'price',
    price_desc: 'price',
    newest: 'createdAt',
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(q && { OR: [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] }),
      ...(category && { category: { slug: category } }),
      price: { gte: minPrice, lte: maxPrice },
    },
    include: { category: true },
    orderBy: { [orderBy[sort] ?? 'createdAt']: sort === 'price_asc' ? 'asc' : 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  return Response.json(products)
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req, 'ADMIN')
  if (authError) return authError

  const body = await req.json()
  const result = productSchema.safeParse(body)
  if (!result.success) return Response.json({ errors: result.error.flatten().fieldErrors }, { status: 400 })

  const { name, ...rest } = result.data
  const slug = name.toLowerCase().replace(/\s+/g, '-')
  const product = await prisma.product.create({ data: { name, slug, ...rest } })

  return Response.json(product, { status: 201 })
}
