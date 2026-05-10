import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51S7c2kKzOsdD7yHkFp0931Y61B1l3792s4w01F8Gk9hH5cQ6R0S7k3O0G1A6G3f9rW6O1k3L2o6J3g6K7x7x", {
  apiVersion: '2024-06-20',
})
