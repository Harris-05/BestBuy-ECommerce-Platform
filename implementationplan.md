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
│   │   ├── assets/           # Images, Fonts, Global CSS
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
- `name`, `email` (unique), `password` (hashed), `role` (enum: user, admin), `resetToken`.

### 2.2 Product Model
- `name`, `slug`, `description`, `price`, `stock`, `images` (array), `category` (ref), `isActive`.

### 2.3 Order Model
- `user` (ref), `items` (embedded), `total`, `status`, `paymentIntentId`, `shippingAddress`.

---

## Phase 3 — Authentication & JWT Security

### 3.1 Auth Logic
- **Signup**: Validate → Hash Password → Save User.
- **Login**: Verify Password → Generate JWT → Set HTTP-only Cookie.
- **Middleware**: `authMiddleware` to verify JWT on protected routes; `adminMiddleware` for role checking.

### 3.2 Security
- Implement **Helmet** for headers and **express-rate-limit** for DDoS protection.
- Ensure passwords are never returned in JSON responses.

---

## Phase 4 — Feature Development

### 4.1 Product Engine
- API: `GET /api/products` with Mongoose query filtering (regex search, price range).
- Frontend: Product Grid with skeleton loaders and persistent filters in URL.

### 4.2 Shopping Cart (Redux)
- Cart logic handled in `cartSlice.ts`.
- Persist cart to `localStorage` for guests and MongoDB for logged-in users.

### 4.3 Stripe Checkout
- `POST /api/orders/checkout`: Create Stripe Payment Intent.
- Frontend: Stripe Elements integration with success redirect.

### 4.4 AI ShopBot (Groq Speed)
- API: Groq streaming endpoint using `groq-sdk`.
- Model: `llama-3.1-70b-versatile` for high-speed reasoning.
- Frontend: Floating chat drawer with instant streaming display.

---

## Phase 5 — Admin Dashboard
- **Admin Stats**: Aggregate sales data using MongoDB `$group` pipelines.
- **Product Management**: Full CRUD UI with Cloudinary upload integration.
- **User Management**: Toggle user status and roles.

---

## Phase 6 — Industrial Enhancements
- **Abandoned Cart**: Cron job to query idle carts and trigger Resend emails.
- **Redis Caching**: Cache product results via Upstash for faster response.
- **Sentry**: Error monitoring for both Client and Server.
- **PWA**: Setup `vite-plugin-pwa` for offline support.
