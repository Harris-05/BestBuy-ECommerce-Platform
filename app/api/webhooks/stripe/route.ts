import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent

    const order = await prisma.order.findFirst({ where: { stripeId: intent.id } })
    if (order) {
      await prisma.order.update({ where: { id: order.id }, data: { status: 'PROCESSING' } })
      await prisma.cart.deleteMany({ where: { userId: order.userId } })
    }
  }

  return Response.json({ received: true })
}
