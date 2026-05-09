# 🤝 MERN Team Collaboration & Task Division

This plan divides the project between **Developer 1 (Client/React)** and **Developer 2 (Server/Database)** to ensure independent, simultaneous development.

---

## 📂 Project Structure

```text
finalproj/
├── client/           # Developer 1 Focus (React, Redux, UI)
│   ├── src/assets/
│   ├── src/components/
│   ├── src/pages/
│   └── src/store/
├── server/           # Developer 2 Focus (Node, Express, Mongo)
│   ├── src/models/
│   ├── src/routes/
│   ├── src/middleware/
│   └── src/utils/
└── README.md
```

---

## 🧑‍💻 Developer 1: Frontend & React State
**Focus:** React UI, Redux Store, Client-side logic, and AI UI.

### 📋 Client Tasks
1. **React Architecture**
   - [ ] Initialize Vite + Tailwind + shadcn/ui.
   - [ ] Setup Redux Toolkit (Auth, Cart, Product, Review Slices).
   - [ ] Build the Product Grid, Search, and Filtering components.
2. **Shopping & Order Flow**
   - [ ] Implement Cart Drawer and Product Detail pages with Reviews.
   - [ ] Build Checkout flow supporting Stripe and COD.
   - [ ] Create **Order Status Pipeline** visualization for users.
3. **Seller & AI UI**
   - [ ] Build **Seller Dashboard** with real-time order updates and product CRUD.
   - [ ] Implement the **AI Field Filler** for seller product creation.
   - [ ] Setup ShopBot chat drawer and Framer Motion animations.

---

## 🧑‍💻 Developer 2: Backend & Infrastructure
**Focus:** Express API, MongoDB Modeling, Security, and Integrations.

### 📋 Server Tasks
1. **API & Database Modeling**
   - [ ] Define Mongoose Schemas: User, Product, Review, Order (with Status enum).
   - [ ] Build JWT Auth logic with RBAC (User/Seller/Admin).
   - [ ] Implement Product search with AI/Groq-assisted smart search.
2. **Business Logic & AI**
   - [ ] Create Seller endpoints for product AI-filling and review replies.
   - [ ] Build MongoDB aggregation for advanced seller analytics.
   - [ ] Implement **Email Pipeline** using Resend + Jinja2-style templates (Nunjucks).
3. **Integrations & Operations**
   - [ ] Setup Stripe for card payments and logic for COD orders.
   - [ ] Integrate **Groq API** for both ShopBot and Seller AI tools.
   - [ ] Configure Sentry and Upstash Redis for production monitoring.

---

## 🚧 Conflict Mitigation Strategy
- **Contract-First Development**: Both developers must agree on the JSON structure of API responses before building.
- **Shared Folders**: All shared types/interfaces should be placed in a root `shared/` folder if using a monorepo.
- **DB Schema**: **Developer 2** manages the Mongoose models; Developer 1 consumes them via the API.
