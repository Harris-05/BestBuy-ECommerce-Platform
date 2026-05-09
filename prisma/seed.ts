import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Books', slug: 'books' },
  { name: 'Home', slug: 'home' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Beauty', slug: 'beauty' },
]

async function main() {
  console.log('Seeding database...')

  // Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@shopsmart.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@shopsmart.com',
      passwordHash: await bcrypt.hash('Admin@1234', 12),
      role: 'ADMIN',
    },
  })

  // Regular user
  await prisma.user.upsert({
    where: { email: 'user@shopsmart.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@shopsmart.com',
      passwordHash: await bcrypt.hash('User@1234', 12),
    },
  })

  const electronics = await prisma.category.findUnique({ where: { slug: 'electronics' } })

  // Sample products
  const products = [
    { name: 'Wireless Headphones', slug: 'wireless-headphones', description: 'Premium over-ear noise-cancelling headphones with 30-hour battery life.', price: 149.99, stock: 50, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], categoryId: electronics!.id },
    { name: 'Smart Watch', slug: 'smart-watch', description: 'Track your fitness, receive notifications, and more.', price: 249.99, stock: 30, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'], categoryId: electronics!.id },
    { name: 'Mechanical Keyboard', slug: 'mechanical-keyboard', description: 'Tactile mechanical switches for a satisfying typing experience.', price: 89.99, stock: 25, images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500'], categoryId: electronics!.id },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('Seeding complete.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
