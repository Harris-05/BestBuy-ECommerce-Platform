# Smart E-Commerce MERN App — Implementation Plan

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| **Frontend** | **React 18** (Vite) | Fast, component-based, industry standard |
| **State Mgmt** | **Redux Toolkit** | Centralized state for Cart, Auth, and UI |
| **Styling** | **Tailwind CSS** + **shadcn/ui** | Rapid, premium UI development |
| **Backend** | **Node.js** + **Express.js** | Scalable, high-performance JS server |
| **Database** | **MongoDB** + **Mongoose** | Flexible NoSQL, perfect for product catalogs |
| **Auth** | **JWT** + **Cookies** | Secure, stateless authentication |
| **AI Chatbot** | **Groq Cloud API** | Ultra-fast LPU inference (Sub-second response) |
| **Payments** | **Stripe** | Professional checkout integration |
| **Image Storage** | **Cloudinary** | Optimized media delivery |
| **Emails** | **Resend** | Transactional email automation |

---

## Project Structure (Monorepo)

```
finalproj/
├── client/                   # React Frontend (Vite)
│   ├── src/
│   │   ├── assets/           # Images, Fonts, bestbuy CSS
│   │   ├── components/       # shadcn/ui & Shared Layouts
│   │   ├── pages/            # Shop, Admin, Auth, Profile
│   │   ├── store/            # Redux Toolkit (auth, cart, products)
│   │   ├── hooks/            # useAuth, useCart, useDebounce
│   │   ├── services/         # API (Axios) instances
│   │   └── lib/              # Utils, Validations (Zod)
│   ├── .env                  # Client-side env (VITE_API_URL)
│   └── tailwind.config.js
├── server/                   # Express Backend
│   ├── src/
│   │   ├── config/           # DB connection, Groq/Stripe config
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Mongoose Schemas
│   │   ├── routes/           # Express Routers
│   │   ├── middleware/       # JWT Auth, Error Handler, Rate Limiter
│   │   └── utils/            # Groq, Stripe, Resend wrappers
│   ├── .env                  # Backend secrets (MONGO_URI, GROQ_API_KEY)
│   └── package.json
├── .gitignore                # Optimized for MERN
└── README.md
```

---

## Phase 1 — Infrastructure & Setup

### 1.1 Backend Setup
- Initialize Node.js project in `/server`.
- Install dependencies: `express mongoose dotenv cors helmet jsonwebtoken bcryptjs cloudinary stripe resend groq-sdk`.
- Configure `mongoose.connect()` to MongoDB Atlas.

### 1.2 Frontend Setup
- Initialize Vite React project in `/client`.
- Install dependencies: `@reduxjs/toolkit react-redux axios framer-motion lucide-react react-router-dom zod`.
- Setup Tailwind CSS and shadcn/ui.

---

## Phase 2 — Database Modeling (Mongoose)

### 2.1 User Model
- `name`, `email` (unique), `password` (hashed), `role` (enum: user, seller, admin), `resetToken`.

### 2.2 Product & Review Models
- **Product**: `name`, `slug`, `description`, `price`, `stock`, `images`, `seller` (ref), `category`, `isActive`.
- **Review**: `product` (ref), `user` (ref), `rating`, `comment`, `reply` (string - for seller), `createdAt`.

### 2.3 Order Model
- `user` (ref), `items` (embedded), `total`, `paymentMethod` (Stripe, COD), `status` (enum: Pending, Confirmed, Shipped, Delivered), `paymentIntentId`.

---

## Phase 3 — Authentication & JWT Security

### 3.1 Auth Logic
- **Signup**: Validate → Hash Password → Save User (default role: user).
- **Seller Onboarding**: Admin-only route to upgrade user to `seller`.
- **RBAC Middleware**: `checkRole(['user', 'seller', 'admin'])` for endpoint protection.

---

## Phase 4 — Feature Development

### 4.1 Smart Product Engine
- API: `GET /api/products` with AI-assisted "Smart Search" (semantic or advanced regex).
- Review System: `POST /api/reviews` for users and `PATCH /api/reviews/:id` for seller replies.

### 4.2 Checkout & Pipeline
- **Payment Logic**: Conditional flow for Stripe (card) and COD.
- **Pipeline UI**: Step-indicator in User Profile showing real-time order status.

### 4.3 AI Chatbot & Seller Tools (Groq)
- **ShopBot**: User-facing assistant for product discovery.
- **Seller AI Assistant**: Endpoint `POST /api/ai/parse-product` to extract structured data from plain text for sellers.

---

## Phase 5 — Dashboard & Email Pipeline

### 5.1 Seller Dashboard
- **Analytics**: Grouped sales data and product performance.
- **Order Management**: Real-time update of status via `PATCH /api/orders/:id/status`.

### 5.2 Transactional Email Pipeline
- **Email Engine**: Resend + **Nunjucks** (Jinja2 equivalent for JS).
- **Trigger System**: Hook into Order status changes to send specific templates for each pipeline step.

---

## Phase 6 — Industrial Enhancements
- **Redis & Sentry**: Performance and error tracking.
- **PWA**: Setup `vite-plugin-pwa`.
- **Search Optimization**: Implement indexing for fast multi-faceted filtering.
