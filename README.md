# 🛍️ Smart E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Anthropic](https://img.shields.io/badge/Claude-AI-D97757?style=for-the-badge&logo=anthropic)](https://www.anthropic.com/)

A production-grade, AI-powered e-commerce ecosystem designed for scale. This platform features a state-of-the-art shopping assistant, real-time analytics, automated marketing tools, and industrial-level security.

---

## ✨ Key Features

### 🛒 Premium Shopping Experience
- **Dynamic Catalog**: Real-time search, multi-faceted filtering, and lightning-fast pagination.
- **AI ShopBot**: A persistent Claude-powered assistant for personalized product discovery.
- **Interactive Cart**: Slide-out drawer with optimistic UI updates and session persistence.

### 🛡️ Industrial Infrastructure
- **Security**: NextAuth (JWT/Credentials), API Rate Limiting (Upstash), and role-based access.
- **Performance**: Redis caching, Cloudinary CDN optimization, and Edge-ready API routes.
- **Observability**: Real-time error tracking with Sentry and detailed analytics via LogLib.

### 📊 Admin & Marketing
- **Full-Scale Dashboard**: Revenue charts, inventory management, and user supervision.
- **Conversion Tools**: Abandoned cart recovery emails, coupon engine, and wishlist functionality.
- **SEO & PWA**: Automated meta-tags and Progressive Web App support for mobile installation.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend** | Next.js API Routes (Node.js), Prisma ORM |
| **Database** | PostgreSQL (Supabase), Redis (Upstash) |
| **AI** | Claude-Sonnet (Anthropic SDK) |
| **Payments** | Stripe (Elements & Webhooks) |
| **Infrastructure** | Vercel, Sentry, Cloudinary, Resend |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/finalproj.git
cd finalproj
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your credentials:
```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# AI & Third Party
ANTHROPIC_API_KEY="..."
STRIPE_SECRET_KEY="..."
CLOUDINARY_URL="..."
RESEND_API_KEY="..."
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 5. Run the development server
```bash
npm run dev
```

---

## 📂 Project Structure

```text
finalproj/
├── app/                  # Next.js App Router (Pages & APIs)
├── components/           # UI Components (shadcn & Custom)
├── lib/                  # Shared Utilities (Prisma, Stripe, AI)
├── prisma/               # Database Schema & Migrations
├── public/               # Static Assets
└── hooks/                # Custom React Hooks
```

---

## 🤝 Collaboration & Roadmap

This project is designed for a team of two developers. 
- See [division.md](./division.md) for the detailed task breakdown.
- See [feature.md](./feature.md) for the full industrial feature list.
- See [implementationplan.md](./implementationplan.md) for the phase-by-phase roadmap.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

> [!TIP]
> Built with ❤️ for industrial-grade web development.
