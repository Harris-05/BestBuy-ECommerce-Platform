# 📜 Project Rubric - Self Evaluation

This document tracks the fulfillment of project requirements as specified in the course rubric.

| ID | Requirement | Max Marks | Status | Obtained |
|:---|:---|:---:|:---:|:---:|
| **Functionality** | | **25** | | **25** |
| 1 | All core features implemented correctly (forms, buttons, interactive elements respond without errors) | 10 | ✅ | 10 |
| 2 | Login and Signup system working end-to-end (registration, authentication, session start) | 10 | ✅ | 10 |
| 3 | Data processing functional (database CRUD or API integration working correctly) | 5 | ✅ | 5 |
| **Password Encryption & Security** | | **20** | | **17** |
| 4 | Passwords hashed using a secure algorithm (bcrypt) before storing in database | 8 | ✅ | 8 |
| 5 | Plain-text passwords never stored or logged anywhere in the system | 5 | ✅ | 5 |
| 6 | Password comparison done securely using hash-comparison functions (not string equality) | 4 | ✅ | 4 |
| 7 | Password reset flow implemented securely (token-based, time-limited link) | 3 | ✅ | 3 |
| **Role-Based Access Control (Admin & User)** | | **30** | | **30** |
| 8 | At least two distinct roles defined: Admin and Regular User (plus Seller role), stored in database | 5 | ✅ | 5 |
| 9 | Admin dashboard accessible only to admin role; regular users redirected or shown 403 | 8 | ✅ | 8 |
| 10 | Admin can manage users: view user list, activate/deactivate accounts, change roles | 7 | ✅ | 7 |
| 11 | Frontend navigation dynamically changes based on logged-in user role (admin sees extra menu items) | 5 | ✅ | 5 |
| 12 | Backend routes protected with middleware/guard that checks role before processing request | 5 | ✅ | 5 |
| **Form Validation** | | **15** | | **15** |
| 13 | Client-side validation: required fields, email format, password strength enforced in browser | 5 | ✅ | 5 |
| 14 | Server-side validation: inputs sanitized and validated before processing | 5 | ✅ | 5 |
| 15 | Clear, inline error messages displayed to user for invalid or missing inputs | 5 | ✅ | 5 |
| **Navigation & Structure** | | **10** | | **10** |
| 16 | Working navbar on every page; all links accessible with no broken routes | 5 | ✅ | 5 |
| 17 | Logical page hierarchy (Home, About, Contact, etc.) with smooth user flow between pages | 3 | ✅ | 3 |
| 18 | Sticky/responsive navbar, dropdown menus, breadcrumbs, or site search | 2 | ✅ | 2 |
| **UI / UX Design** | | **10** | | **10** |
| 19 | Clean, consistent layout — uniform colors, fonts, and spacing throughout | 5 | ✅ | 5 |
| 20 | Responsive design: layout adapts correctly on desktop, tablet, and mobile screens | 5 | ✅ | 5 |
| **Authentication & Session Management** | | **15** | | **13** |
| 21 | Functional login/logout with correct session handling and cookie use | 10 | ✅ | 10 |
| 22 | Session expires after inactivity; re-login required for sensitive actions | 5 | ✅ | 5 |
| **Git Version Control** | | **10** | | **10** |
| 23 | Repository initialized and hosted on GitHub/GitLab with proper project structure | 3 | ✅ | 3 |
| 24 | Minimum 10 meaningful commits reflecting incremental development progress | 4 | ✅ | 4 |
| 25 | Clear commit messages following a consistent naming convention (feat:, fix:, docs:) | 3 | ✅ | 3 |
| **Footer & Layout Components** | | **5** | | **5** |
| 26 | Footer present on all pages with contact info, social links, and copyright notice | 5 | ✅ | 5 |
| **Content & Creativity** | | **30** | | **30** |
| 27 | Original, relevant, and well-written content across all pages | 5 | ✅ | 5 |
| 28 | Effective use of images, icons, illustrations, or multimedia that enhance the design | 5 | ✅ | 5 |
| 29 | Unique or innovative project concept — AI-powered assistant and seller automation | 5 | ✅ | 5 |
| 30 | Visual design quality: color palette, typography, whitespace, and overall aesthetic polish | 5 | ✅ | 5 |
| 31 | Animations, transitions, or micro-interactions used tastefully to enhance UX | 5 | ✅ | 5 |
| 32 | Overall creative impression: layout creativity, theme consistency, and user delight factor | 5 | ✅ | 5 |
| **Performance & Optimization** | | **5** | | **5** |
| 33 | Pages load quickly; images and assets optimized; minimal unnecessary scripts | 5 | ✅ | 5 |
| **Documentation & Presentation** | | **3** | | **3** |
| 34 | README or project report included with clear explanation of features and setup steps | 3 | ✅ | 3 |
| | **Total Marks** | **178** | | **178** |

---

### 📝 Evaluation Notes:
- **Requirement 7 (Password Reset):** Fully implemented with token-based logic and secure email notifications.
- **Requirement 22 (Session Expiry):** Sessions are managed via JWT with a 1-hour expiration. Additionally, a client-side inactivity listener logs out the user after 15 minutes of no interaction.
- **Requirement 29 (Innovation):** The integration of **Groq AI** for the ShopBot and AI-powered product description parsing for sellers provides a unique edge over generic e-commerce templates.
