# Smart E-Commerce Web App — Implementation Plan

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | **Next.js 14** (App Router) | SSR/SSG, file-based routing, built-in API routes |
| Styling | **Tailwind CSS** + **shadcn/ui** | Fast, consistent, responsive UI |
| Backend | **Next.js API Routes** (Node.js) | Monorepo simplicity, no separate server needed |
| Database | **PostgreSQL** via **Prisma ORM** | Relational, ACID, great for e-commerce |
| Auth | **NextAuth.js v5** | Session, JWT, OAuth, role support |
| AI Chatbot | **Claude API** (claude-sonnet-4-6) | Product assistance + recommendations |
| Payments | **Stripe** (test mode) | Industry standard checkout |
| Image Storage | **Cloudinary** | Optimized image delivery |
| Email | **Resend** | Transactional emails (reset, order confirm) |
| Hosting | **Vercel** (frontend) + **Supabase** (Postgres) | Free tier, production-grade |
| Version Control | **GitHub** | Required by rubric |

---

## Project Structure

```
finalproj/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (shop)/
│   │   ├── page.tsx                  # Home
│   │   ├── products/
│   │   │   ├── page.tsx              # Product listing
│   │   │   └── [slug]/page.tsx       # Product detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── (account)/
│   │   ├── account/page.tsx
│   │   └── account/orders/[id]/page.tsx
│   ├── admin/
│   │   ├── page.tsx                  # Dashboard
│   │   ├── products/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── orders/page.tsx
│   │   └── users/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── auth/register/route.ts
│   │   ├── auth/forgot-password/route.ts
│   │   ├── auth/reset-password/route.ts
│   │   ├── products/route.ts
│   │   ├── products/[id]/route.ts
│   │   ├── categories/route.ts
│   │   ├── cart/route.ts
│   │   ├── cart/[itemId]/route.ts
│   │   ├── orders/route.ts
│   │   ├── orders/[id]/route.ts
│   │   ├── reviews/route.ts
│   │   ├── admin/users/route.ts
│   │   ├── admin/users/[id]/route.ts
│   │   ├── admin/stats/route.ts
│   │   └── ai/chat/route.ts
│   ├── 403/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/                           # shadcn primitives
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ReviewForm.tsx
│   │   └── StarRating.tsx
│   ├── admin/
│   │   ├── DataTable.tsx
│   │   ├── StatsCard.tsx
│   │   └── ProductForm.tsx
│   └── ai/
│       └── ChatBot.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── stripe.ts
│   ├── cloudinary.ts
│   ├── claude.ts
│   ├── resend.ts
│   ├── auth-helpers.ts
│   └── validations/
│       ├── auth.ts
│       ├── product.ts
│       └── order.ts
├── hooks/
│   ├── useCart.ts
│   ├── useAuth.ts
│   └── useDebounce.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── middleware.ts
├── .env.local
└── README.md
```

---

## Phase 1 — Project Setup & Infrastructure

### 1.1 Initialize Repository
- `npx create-next-app@latest finalproj --typescript --tailwind --app`
- Install dependencies:
  ```
  npm install prisma @prisma/client next-auth@beta bcryptjs zod
  npm install react-hook-form @hookform/resolvers
  npm install framer-motion
  npm install stripe @stripe/stripe-js @stripe/react-stripe-js
  npm install cloudinary
  npm install resend
  npm install @anthropic-ai/sdk
  npm install lucide-react
  npx shadcn@latest init
  ```
- Initialize Prisma: `npx prisma init`
- Create GitHub repo, push initial commit

### 1.2 Environment Variables
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
```

---

## Phase 2 — Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  passwordHash  String
  role          Role      @default(USER)
  isActive      Boolean   @default(true)
  resetToken    String?
  resetTokenExp DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  orders        Order[]
  reviews       Review[]
  cart          Cart?
}

enum Role {
  USER
  ADMIN
}

model Category {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique
  image    String?
  products Product[]
}

model Product {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String
  price       Decimal     @db.Decimal(10, 2)
  stock       Int         @default(0)
  images      String[]
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  reviews     Review[]
  cartItems   CartItem[]
  orderItems  OrderItem[]
}

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id])
  items     CartItem[]
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String  @id @default(cuid())
  cartId    String
  cart      Cart    @relation(fields: [cartId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
}

model Order {
  id        String      @id @default(cuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  stripeId  String?
  items     OrderItem[]
  address   Json
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
}

model Review {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  rating    Int
  comment   String
  createdAt DateTime @default(now())

  @@unique([userId, productId])
}
```

### Seed Data
- 2 admin users, 10 regular users
- 6 categories (Electronics, Clothing, Books, Home, Sports, Beauty)
- 40+ products with Cloudinary images
- Sample orders and reviews

---

## Phase 3 — Authentication & Security

### 3.1 NextAuth Configuration (`lib/auth.ts`)
- Credentials provider with bcrypt verification
- JWT strategy storing `id`, `role`, `email`, `name`
- Session max age: 30 minutes idle / 30 days with remember-me
- Callbacks to attach role to session token

### 3.2 Password Security (`lib/auth-helpers.ts`)
```ts
import bcrypt from 'bcryptjs'

// Hash on registration — 12 rounds
export const hashPassword = (plain: string) => bcrypt.hash(plain, 12)

// Compare on login — never use string equality
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash)

// passwordHash field NEVER returned from any API route
// passwordHash NEVER appears in logs
```

### 3.3 Password Reset Flow
1. User submits email to `POST /api/auth/forgot-password`
2. Generate raw token: `crypto.randomBytes(32).toString('hex')`
3. Hash token with `bcrypt.hash(rawToken, 10)` — store hash + expiry (1 hour) in `User.resetToken`
4. Send email via Resend with link: `https://domain.com/reset-password?token=<rawToken>`
5. `POST /api/auth/reset-password` receives raw token + new password
6. Find user where `resetTokenExp > now()`, verify `bcrypt.compare(rawToken, storedHash)`
7. Update `passwordHash`, clear `resetToken` and `resetTokenExp`

### 3.4 Route Protection Middleware (`middleware.ts`)
```ts
export function middleware(req: NextRequest) {
  const token = await getToken({ req })

  // Admin routes — require ADMIN role
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', req.url))
    }
  }

  // Account routes — require any authenticated user
  if (req.nextUrl.pathname.startsWith('/account')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Checkout — require authentication
  if (req.nextUrl.pathname.startsWith('/checkout')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login?callbackUrl=/checkout', req.url))
    }
  }
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/checkout/:path*'],
}
```

### 3.5 API Route Guard Helper
```ts
// lib/api-guard.ts
export async function requireAuth(req: NextRequest, role?: 'ADMIN') {
  const token = await getToken({ req })
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (role && token.role !== role) return Response.json({ error: 'Forbidden' }, { status: 403 })
  return null // no error
}
```

---

## Phase 4 — API Routes

### Products API
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List with search, filter, sort, pagination |
| GET | `/api/products/[id]` | Public | Product detail |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/[id]` | Admin | Update product |
| DELETE | `/api/products/[id]` | Admin | Soft-delete (`isActive=false`) |

Query params for `GET /api/products`:
- `q` — full-text search on name + description
- `category` — category slug
- `minPrice`, `maxPrice` — price range
- `sort` — `price_asc`, `price_desc`, `rating`, `newest`
- `page`, `limit` — pagination

### Auth API
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Validate → hash → create user |
| POST | `/api/auth/forgot-password` | Public | Generate reset token + send email |
| POST | `/api/auth/reset-password` | Public | Verify token → update password |

### Cart API
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/cart` | User | Get user's cart with products |
| POST | `/api/cart` | User | Add item or increment quantity |
| PUT | `/api/cart/[itemId]` | User | Update quantity |
| DELETE | `/api/cart/[itemId]` | User | Remove item |

### Orders API
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/orders` | User | User's order history |
| POST | `/api/orders` | User | Create order + Stripe payment intent |
| GET | `/api/orders/[id]` | User | Order detail (owner or admin only) |
| PATCH | `/api/orders/[id]` | Admin | Update order status |

### Reviews API
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/reviews` | User | Submit review (one per product) |
| DELETE | `/api/reviews/[id]` | Admin | Remove review |

### Admin API
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/users` | Admin | Paginated user list |
| PATCH | `/api/admin/users/[id]` | Admin | Toggle `isActive`, change role |
| GET | `/api/admin/stats` | Admin | Revenue, orders, users, top products |

### AI API
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/chat` | User | Stream Claude response with product context |

---

## Phase 5 — Form Validation

### Zod Schemas (`lib/validations/`)

**auth.ts**
```ts
export const signupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Required'),
  rememberMe: z.boolean().optional(),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^a-zA-Z0-9]/),
})
```

**product.ts**
```ts
export const productSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().cuid(),
  images: z.array(z.string().url()).min(1),
})
```

### Client-Side Integration
- `react-hook-form` with `@hookform/resolvers/zod`
- Inline error messages below each field (`<p className="text-red-500 text-sm">`)
- Password strength meter component (colored progress bar: weak/fair/strong/very strong)
- Real-time validation on blur, submit validation on form submit

### Server-Side Validation
```ts
// Every POST/PUT API route:
const result = schema.safeParse(await req.json())
if (!result.success) {
  return Response.json(
    { errors: result.error.flatten().fieldErrors },
    { status: 400 }
  )
}
```

---

## Phase 6 — Pages & UI

### Home Page (`/`)
- Full-width hero with animated headline + CTA buttons
- Category grid (6 cards with icons)
- Featured products carousel
- "Why shop with us" features section
- Testimonials section
- Newsletter signup form

### Product Listing (`/products`)
- Left sidebar: category filter, price range slider, star rating filter
- Top bar: search input, sort dropdown, view toggle (grid/list), results count
- Responsive grid: 1 col mobile / 2 col tablet / 3-4 col desktop
- Product cards: image, name, rating stars, price, add-to-cart button
- Skeleton loaders during fetch
- URL-synced filters (shareable links)
- Cursor-based pagination

### Product Detail (`/products/[slug]`)
- Image gallery with thumbnail strip
- Product name, category breadcrumb, rating summary
- Price, stock indicator (in stock / low stock / out of stock)
- Quantity selector + add-to-cart button
- Description tab, reviews tab
- Review form (authenticated users only)
- Related products row (same category, sorted by rating)

### Cart (`/cart`)
- Item list: image, name, price, quantity stepper, remove button
- Order summary sidebar: subtotal, shipping estimate, tax, total
- "Continue shopping" link + "Proceed to checkout" button
- Empty state with illustration + shop CTA
- Optimistic updates on quantity change

### Checkout (`/checkout`)
- Step indicator (1. Details → 2. Payment → 3. Confirmation)
- Shipping address form (validated)
- Stripe Elements card input
- Order summary sidebar
- Success page with order number

### Admin Dashboard (`/admin`)
- Stats cards: total revenue, orders today, active users, low-stock count
- Revenue chart (last 30 days, line chart via Recharts)
- Recent orders table
- Top products by sales

### Admin Products (`/admin/products`)
- DataTable: name, category, price, stock, status, actions
- Search + category filter
- Create/Edit modal with full product form + image upload (Cloudinary)
- Soft-delete with confirmation dialog

### Admin Users (`/admin/users`)
- DataTable: name, email, role, status, join date, actions
- Toggle active/inactive (with confirmation)
- Change role dropdown
- View user's order count

### Admin Orders (`/admin/orders`)
- DataTable: order ID, user, total, status, date, actions
- Status update dropdown (PENDING → PROCESSING → SHIPPED → DELIVERED)
- Order detail modal

---

## Phase 7 — Navbar & Layout

### Navbar Features
- Logo left, category links center, actions right (search, cart, user menu)
- Cart icon with item count badge (red dot)
- User menu: shows "My Account" + "Orders" for users, adds "Admin Panel" for admins
- Unauthenticated: Login + Signup buttons
- Responsive: hamburger on mobile → slide-in drawer with full nav
- Sticky with scroll-aware background (transparent on hero, solid below)
- Integrated search bar (expands on click, debounced)

### Footer Sections
- Column 1: Logo + tagline + social links (Instagram, Twitter, Facebook, GitHub)
- Column 2: Shop links (All Products, Categories, Sale)
- Column 3: Account links (Login, My Orders, Profile)
- Column 4: Company links (About, Contact, FAQ)
- Bottom bar: copyright notice + payment method icons

---

## Phase 8 — AI Chatbot

### Claude API Integration (`lib/claude.ts`)
```ts
import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})
```

### System Prompt
```
You are ShopBot, a friendly AI shopping assistant for [StoreName].
You help customers find products, compare options, and make purchase decisions.
When recommending specific products, include their slug in this format:
[Product Name](/products/slug)
Keep responses concise and helpful. If asked about prices, stock, or specs,
use only the product context provided — do not invent information.
```

### Chat API Route (`/api/ai/chat`)
1. Receive `{ messages: Message[], query: string }` from client
2. Extract keywords from `query` (category, price hints, product type)
3. Query Prisma for up to 10 matching products
4. Build a context string: product name, price, category, rating, stock
5. Prepend context to the user's message
6. Call `anthropic.messages.create()` with streaming
7. Return `ReadableStream` to client

### ChatBot Component
- Floating button (bottom-right corner) with chat bubble icon
- Click → spring-animated drawer opens from bottom-right
- Conversation history with user and bot message bubbles
- Typing indicator (animated dots)
- Clickable product cards rendered from bot's product links
- Clear conversation button
- Persisted in `localStorage` across page navigations

### Recommendation Engine
- Product detail page: fetch same-category products ordered by avg rating, exclude current
- Chatbot: Claude extracts intent (category, budget) from natural language, filters DB accordingly
- Home page "Recommended for you": if logged in, use user's order/browse history

---

## Phase 9 — Stripe Integration

### Payment Flow
1. User clicks "Place Order" on checkout
2. Client calls `POST /api/orders` with cart + address
3. Server validates cart, calculates total server-side (never trust client price)
4. Server creates Stripe `PaymentIntent` with calculated amount
5. Returns `clientSecret` to client
6. Client confirms payment with Stripe Elements
7. On success, Stripe webhook triggers `POST /api/webhooks/stripe`
8. Webhook verifies signature, updates order status to `PROCESSING`, clears cart
9. Redirect to `/account/orders/[id]` success page

---

## Phase 10 — Animations (Framer Motion)

| Element | Animation |
|---|---|
| Page transitions | Fade + 8px vertical slide, 0.2s ease |
| Product cards | `whileHover`: scale 1.02, shadow increase |
| Cart drawer | `AnimatePresence` + slide from right (x: 400 → 0) |
| ChatBot drawer | Spring physics, slide + fade |
| Add-to-cart button | Brief scale pulse on click |
| Cart badge | Bounce when count increases |
| Navbar | Smooth background opacity on scroll |
| Toast notifications | Slide in from top-right, auto-dismiss |
| Modal dialogs | Scale + fade (0.8 → 1.0) |
| Skeleton loaders | Shimmer gradient animation |

---

## Phase 11 — Responsive Design

| Breakpoint | Product Grid | Navbar | Cart |
|---|---|---|---|
| Mobile (`< 640px`) | 1 column | Hamburger + drawer | Full-screen overlay |
| Tablet (`640–1024px`) | 2 columns | Condensed links | Side drawer |
| Desktop (`> 1024px`) | 3–4 columns | Full nav | Side drawer |

- All forms stack vertically on mobile
- Admin tables become horizontal-scroll cards on mobile
- Touch-friendly tap targets (minimum 44×44px)
- No horizontal overflow on any breakpoint

---

## Phase 12 — Performance Optimization

- All images served via Cloudinary CDN with `f_auto,q_auto,w_auto` transformation
- Next.js `<Image>` component with `sizes` prop for responsive images
- Product listing pages use ISR with `revalidate: 60`
- Static generation for category pages
- Dynamic imports for ChatBot, Admin charts (reduce initial bundle)
- `loading.tsx` streaming for all routes
- Cursor-based pagination (no SQL `OFFSET`)
- Debounced search (300ms)
- React Query for client-side caching of cart/user data

---

## Phase 13 — Design System

### Color Palette
```
Primary:    #1a1a2e  (dark navy)
Accent:     #e94560  (vivid red)
Surface:    #16213e  (deep blue)
Muted:      #6b7280  (gray-500)
Background: #ffffff  (white)
Dark bg:    #0f0f1a  (near black)
Success:    #10b981  (emerald)
Warning:    #f59e0b  (amber)
Error:      #ef4444  (red)
```

### Typography
- Headings: `Playfair Display` (Google Fonts via `next/font`)
- Body: `Inter` (Google Fonts via `next/font`)
- Monospace: `JetBrains Mono` (for order IDs, codes)

### Spacing
- Base unit: 4px (Tailwind default)
- Section padding: `py-16` / `py-24` on desktop
- Card padding: `p-6`
- Gap between grid items: `gap-6`

---

## Phase 14 — Testing Plan

### Unit Tests (Vitest)
- Zod schema validation (valid/invalid inputs for each schema)
- `hashPassword` and `verifyPassword` behavior
- Price calculation utilities
- Cart total calculation

### Integration Tests (Vitest + Supertest)
- `POST /api/auth/register` — success, duplicate email, weak password
- `POST /api/auth/forgot-password` — valid email, unknown email
- `GET /api/products` — with/without filters
- `POST /api/cart` — add item, update quantity, unauthenticated
- Admin routes — access with USER role returns 403

### E2E Tests (Playwright)
- Full signup → browse → add to cart → checkout flow
- Login with wrong password shows error
- Admin can create a product that appears in listing
- Password reset flow end-to-end

### AI Validation
- Log 20 sample chatbot exchanges, review for hallucinated product info
- Verify product links in responses resolve to real product pages

---

## Phase 15 — Git Workflow

### Commit Convention
```
feat:     new feature
fix:      bug fix
chore:    tooling, config, deps
docs:     documentation only
style:    formatting, no logic change
refactor: code change without feature/fix
test:     adding or updating tests
perf:     performance improvement
```

### Planned Commits (minimum 15)
1. `chore: initialize Next.js project with Tailwind, shadcn, and Prisma`
2. `feat: database schema with User, Product, Order, Cart, Review models`
3. `chore: seed database with categories, products, and admin user`
4. `feat: NextAuth credentials provider with bcrypt password hashing`
5. `feat: signup and login pages with Zod validation and error messages`
6. `feat: password reset flow with token-based time-limited email link`
7. `feat: route protection middleware for admin and account routes`
8. `feat: product catalog API with search, filter, sort, and pagination`
9. `feat: product listing and detail pages with responsive layout`
10. `feat: shopping cart with API, drawer UI, and optimistic updates`
11. `feat: checkout page with Stripe payment integration`
12. `feat: order management, history pages, and status tracking`
13. `feat: review and rating system with one-review-per-product enforcement`
14. `feat: admin dashboard with user management, product CRUD, and stats`
15. `feat: AI chatbot with Claude API streaming and product recommendations`
16. `feat: responsive navbar with role-aware menu and mobile drawer`
17. `perf: image optimization with Cloudinary and Next.js Image component`
18. `style: animations and micro-interactions with Framer Motion`
19. `test: unit and integration tests for auth, cart, and product APIs`
20. `docs: README with setup instructions, features, and live demo link`

---

## Phase 16 — Deployment

### Supabase (Database)
1. Create project at supabase.com
2. Copy `DATABASE_URL` (connection pooling URL for serverless)
3. Run `npx prisma migrate deploy`
4. Run `npx prisma db seed`

### Cloudinary (Images)
1. Create free account
2. Create upload preset (unsigned, for admin uploads)
3. Add cloud name + API key + secret to env vars

### Vercel (Frontend + API)
1. Push repo to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy — automatic on every push to `main`
5. Add custom domain (optional)

### Stripe Webhook
1. In Stripe dashboard → Webhooks → Add endpoint
2. URL: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Phase 17 — Documentation

### README.md Sections
- Project Overview
- Tech Stack
- Getting Started (Local Setup)
- Feature List
- API Documentation
- Deployment Guide
- Contribution Guidelines

---

## Phase 18 — Marketing Automation

### 18.1 Abandoned Cart Recovery
- Create a Cron Job (Vercel Cron) that runs every 4 hours.
- Query `Cart` items older than 24h where `user` has not placed an order since.
- Send personalized email via Resend with a "Complete Your Purchase" CTA.

### 18.2 Coupon System
- Extend Prisma schema with `Coupon` model: `code`, `discountType`, `value`, `minAmount`, `expiry`, `usageLimit`.
- Update `POST /api/orders` to validate and apply coupons server-side.
- Add "Apply Coupon" field to Checkout UI.

---

## Phase 19 — Industrial Security & Rate Limiting

### 19.1 API Rate Limiting (Upstash)
- Install `@upstash/ratelimit` and `@upstash/redis`.
- Create a global rate limiter middleware for `/api/:path*`.
- Set limits: 60 requests/minute for general API, 5 requests/minute for Auth/AI routes.

### 19.2 Security Audit
- Implement `helmet` for secure HTTP headers.
- Sanitize all user inputs to prevent XSS.
- Add "Login Activity" table to track IP and browser for security alerts.

---

## Phase 20 — Observability & Performance

### 20.1 Sentry Integration
- Initialize Sentry for Next.js (`npx @sentry/wizard -i nextjs`).
- Configure Source Maps for production debugging.
- Add `captureException` in all global error boundaries.

### 20.2 Redis Caching
- Use Upstash Redis to cache product catalog results for 5 minutes.
- Invalidate cache on Admin product updates (`PUT /api/products/[id]`).

---

## Phase 21 — PWA & UX Polish

### 21.1 PWA Setup
- Configure `next-pwa` with `manifest.json`.
- Add service workers for offline asset caching.
- Add "Install App" prompt for mobile users.

### 21.2 Dark Mode
- Implement `next-themes` for persistent dark/light mode toggle.
- Audit all Tailwind classes for `dark:` variants.
1. **Project Overview** — what it is, screenshots
2. **Live Demo** — Vercel URL
3. **Tech Stack** — table of technologies
4. **Features** — bullet list of all features
5. **Setup Instructions**
   ```bash
   git clone https://github.com/user/finalproj
   cd finalproj
   npm install
   cp .env.example .env.local
   # Fill in .env.local values
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```
6. **Environment Variables** — table with name, description, where to get it
7. **Project Structure** — top-level directory explanation
8. **API Documentation** — key routes with method, path, auth, description
9. **Walkthrough Video** — Loom link

---

## Rubric Coverage Checklist

| # | Requirement | Implementation |
|---|---|---|
| 1 | All core features implemented | Full e-commerce flow: browse, cart, checkout, orders, reviews |
| 2 | Login/Signup end-to-end | NextAuth credentials provider, session management |
| 3 | Database CRUD | Prisma + PostgreSQL, all models with full CRUD |
| 4 | Passwords hashed with bcrypt | `bcrypt.hash(plain, 12)` on registration |
| 5 | No plain-text passwords stored/logged | `passwordHash` excluded from all API responses |
| 6 | Secure password comparison | `bcrypt.compare()` only, no string equality |
| 7 | Secure password reset | `crypto.randomBytes(32)` token, hashed in DB, 1-hour expiry |
| 8 | Two roles: Admin and User | `Role` enum in Prisma schema, stored in DB |
| 9 | Admin dashboard protected | Middleware + API guards return 403 for non-admins |
| 10 | Admin manages users | View list, toggle active, change role |
| 11 | Role-aware frontend navigation | Navbar reads `session.user.role`, shows admin menu |
| 12 | Backend route middleware | `requireAuth()` helper on every protected API route |
| 13 | Client-side validation | `react-hook-form` + Zod resolver, real-time errors |
| 14 | Server-side validation | `schema.safeParse()` in every API route |
| 15 | Inline error messages | Field-level error display on all forms |
| 16 | Working navbar on every page | Persistent layout with `app/layout.tsx` |
| 17 | Logical page hierarchy | Home → Products → Detail → Cart → Checkout |
| 18 | Sticky navbar, breadcrumbs, search | All three implemented |
| 19 | Clean consistent layout | Design system with fixed palette, fonts, spacing |
| 20 | Responsive design | Tailwind breakpoints, tested on 3 viewport sizes |
| 21 | Login/logout + session/cookie | NextAuth JWT session, remember-me cookie |
| 22 | Session expires on inactivity | `maxAge` 1800s default, 2592000s with remember-me |
| 23 | GitHub repository | Initialized on day 1 |
| 24 | 10+ meaningful commits | 20 planned commits (see Phase 15) |
| 25 | Consistent commit messages | `feat:`, `fix:`, `chore:`, etc. convention |
| 26 | Footer on all pages | Persistent in `app/layout.tsx` with all required info |
| 27 | Original relevant content | Custom copy, product descriptions, about/contact pages |
| 28 | Images, icons, multimedia | Cloudinary images, Lucide icons, hero illustrations |
| 29 | Innovative concept | AI chatbot + smart recommendations differentiate from generic shop |
| 30 | Visual design quality | Navy/red palette, Playfair Display headings, generous whitespace |
| 31 | Animations and micro-interactions | Framer Motion throughout (see Phase 10) |
| 32 | Overall creative impression | Theme consistency, AI integration, polished UX |
| 33 | Performance optimization | Cloudinary CDN, ISR, code splitting, debounced search |
| 34 | README / documentation | Full README with setup, API docs, env vars |
| 35 | Live demo / walkthrough | Vercel deployment + Loom recording |

---

## Day-by-Day Timeline

| Day | Focus | Deliverables |
|---|---|---|
| 1 | Setup | Next.js scaffold, Prisma schema, seed data, GitHub repo, first 3 commits |
| 2 | Auth | NextAuth, signup/login pages, bcrypt, middleware, session |
| 3 | Auth Security | Password reset flow, Zod validation, error messages |
| 4 | Products API | CRUD endpoints, search, filter, sort, pagination |
| 5 | Shop UI | Home page, product listing, product detail, responsive layout |
| 6 | Cart | Cart API, CartDrawer, optimistic updates, quantity controls |
| 7 | Checkout | Stripe integration, order creation, success page |
| 8 | Orders & Reviews | Order history, review form, star ratings |
| 9 | Admin | Dashboard stats, product CRUD modal, user management |
| 10 | AI | Claude chatbot API, ChatBot component, recommendation engine |
| 11 | Design Polish | Framer Motion animations, design system refinement, dark mode |
| 12 | Performance | Cloudinary optimization, bundle analysis, ISR pages |
| 13 | Testing | Vitest unit/integration, Playwright E2E, bug fixes |
| 14 | Launch | README, Vercel deploy, Stripe webhook, Loom recording, final commits |
