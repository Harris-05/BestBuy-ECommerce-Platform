# 🛍️ Smart E-Commerce MERN Platform

[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Groq](https://img.shields.io/badge/Groq-AI_Speed-orange?style=for-the-badge&logo=groq)](https://groq.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)

A production-grade, AI-powered e-commerce ecosystem built on the **MERN** stack. This platform features a high-performance React frontend and a scalable Express/MongoDB backend, with ultra-fast AI assistance powered by **Groq**.

---

## ✨ Key Features
- **MERN Architecture**: Full-stack JavaScript for seamless development.
- **Ultra-Fast AI ShopBot**: Sub-second shopping assistance via Groq's LPU.
- **Seller AI Assistant**: Set product fields from plain English text using LLMs.
- **Order Pipeline**: Real-time status tracking with automated email notifications.
- **Multi-Payment Gateway**: Stripe, Card, and Cash on Delivery (COD) support.
- **Review System**: User comments and seller replies with AI moderation.
- **Enterprise Security**: JWT-in-Cookie auth, API rate limiting, and RBAC.
- **Admin & Seller Suite**: Real-time sales analytics and complete inventory CRUD.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/finalproj.git
cd finalproj

# Install Client deps
cd client && npm install

# Install Server deps
cd ../server && npm install
```

### 2. Environment Setup
Create `.env` files in both `/client` and `/server` directories based on the project documentation.

### 3. Run Development
```bash
# Start Server
cd server && npm run dev

# Start Client
cd client && npm run dev
```

---

## 📂 Project Structure

```text
finalproj/
├── client/           # React Frontend (Vite)
│   ├── src/assets/   # bestbuy styles & images
│   ├── src/components/ # Reusable UI components
│   └── src/store/    # Redux state management
├── server/           # Express Backend
│   ├── src/models/   # Mongoose schemas
│   ├── src/routes/   # API endpoints
│   └── src/utils/    # Groq & Stripe integrations
└── README.md
```

---

## 📂 Documentation
- [Feature List](./feature.md)
- [Implementation Plan](./implementationplan.md)
- [Team Division](./division.md)
- [Grading Verification](./verification.md)

---

## 📜 License
MIT License

---

## Deploy On Vercel (Single Project)

This repository is now configured to deploy as one Vercel project:
- Frontend: Vite static build from [client/package.json](client/package.json)
- Backend: Serverless API function from [server/api/index.js](server/api/index.js)
- Routing config: [vercel.json](vercel.json)

### 1. Push your latest code
```bash
git add .
git commit -m "chore: prepare single-project vercel deploy"
git push origin main
```

### 2. Import project in Vercel
1. Open Vercel dashboard
2. Click New Project
3. Import your GitHub repository
4. Keep root as the repository root (do not set Root Directory to client or server)
5. Framework Preset can stay as Other

### 3. Configure environment variables in Vercel
Set these in Project Settings -> Environment Variables:

Required backend vars:
- MONGO_URI
- JWT_SECRET
- CLIENT_URL = https://YOUR_VERCEL_DOMAIN.vercel.app

Optional backend vars (needed for related features):
- GROQ_API_KEY (AI chat)
- STRIPE_SECRET_KEY (card payments)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- RESEND_API_KEY

Required frontend vars:
- VITE_API_URL = /api
- VITE_STRIPE_PUBLISHABLE_KEY (if Stripe checkout is enabled)

### 4. Deploy
1. Click Deploy
2. Wait for build to finish
3. Open production URL

### 5. Verify production
1. Open app home page
2. Sign up / login (checks cookie + JWT flow)
3. Open products page and search/filter
4. Add to cart and test checkout (COD and/or Stripe)
5. Open seller dashboard (checks SSE stream and seller APIs)

### 6. Redeploy after changes
Any push to your connected branch triggers a new deployment automatically.
