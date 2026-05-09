import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api-guard'
import { anthropic } from '@/lib/claude'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req)
  if (authError) return authError

  const { messages, query } = await req.json()

  // Fetch relevant products based on the query keywords
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 10,
    include: { category: true },
  })

  const productContext = products.map(p =>
    `- ${p.name} (${p.category.name}) | $${p.price} | Stock: ${p.stock} | /products/${p.slug}`
  ).join('\n')

  const systemPrompt = `You are ShopBot, a friendly AI shopping assistant.
Help customers find products, compare options, and make purchase decisions.
When recommending products, link them as [Product Name](/products/slug).
Keep responses concise. Only use product info from the context below — do not invent details.

Available products:
${productContext}`

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
