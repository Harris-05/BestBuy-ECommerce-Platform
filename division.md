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
   - [ ] Setup Redux Toolkit (Auth, Cart, Product Slices).
   - [ ] Build the Product Grid, Search, and Filtering components.
2. **Shopping Flow**
   - [ ] Implement Cart Drawer with optimistic updates.
   - [ ] Build the Checkout flow with Stripe Elements.
   - [ ] Create user account and order history views.
3. **AI & UI Polish**
   - [ ] Implement the ShopBot chat drawer.
   - [ ] Setup Framer Motion animations and Skeleton loaders.
   - [ ] Configure `vite-plugin-pwa` and Dark Mode.

---

## 🧑‍💻 Developer 2: Backend & Infrastructure
**Focus:** Express API, MongoDB Modeling, Security, and Integrations.

### 📋 Server Tasks
1. **API & Database**
   - [ ] Setup Express server and Mongoose connection.
   - [ ] Define Mongoose Schemas (User, Product, Order, Coupon).
   - [ ] Build JWT Authentication logic with HttpOnly cookies.
2. **Admin & Logic**
   - [ ] Create Admin CRUD endpoints with Cloudinary integration.
   - [ ] Build MongoDB aggregation pipelines for dashboard stats.
   - [ ] Implement Server-side Zod validation and Error Middleware.
3. **Operations**
   - [ ] Integrate Stripe Webhooks and Resend email automation.
   - [ ] Implement the **Groq API** streaming route for the ShopBot.
   - [ ] Setup Upstash Redis for rate limiting and query caching.
   - [ ] Configure Sentry for backend error monitoring.

---

## 🚧 Conflict Mitigation Strategy
- **Contract-First Development**: Both developers must agree on the JSON structure of API responses before building.
- **Shared Folders**: All shared types/interfaces should be placed in a root `shared/` folder if using a monorepo.
- **DB Schema**: **Developer 2** manages the Mongoose models; Developer 1 consumes them via the API.
