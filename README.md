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
- **Redux State Mgmt**: Centralized management for cart, auth, and products.
- **Enterprise Security**: JWT-in-Cookie auth, API rate limiting, and RBAC.
- **Admin Suite**: Real-time sales analytics and complete inventory CRUD.

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
│   ├── src/assets/   # Global styles & images
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
