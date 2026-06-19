#DineVerse

> DineVerse is a polished full-stack application designed to bridge the gap between luxury fine dining venues and seamless digital orchestrationby delivering a secure, user-friendly reservation and payment experience.

---

## Key Features

- **End-to-end booking flow**
  - Users can authenticate, browse menus and private dining venues, reserve a booking, and complete payments through a unified React interface.
- **Secure payment processing**
  - Stripe-hosted checkout sessions are created server-side, and payments are verified before bookings are confirmed.
- **Real-time notifications**
  - Socket.IO events broadcast booking updates to connected clients and admin dashboards for live operational visibility.
- **Protected route access**
  - JWT-based authentication is enforced on private pages and payment endpoints to prevent unauthorized use.
- **High-end UI presentation**
  - Tailwind + Glassmorphism styling with hover-glow effects and Framer Motion transitions provides a luxury brand experience.

---

## Tech Stack & Architecture

### Frontend
- **React** — declarative UI with reusable components for dynamic pages and responsive interactions.
- **Vite** — fast local development server and optimized build pipeline for modern browser support.
- **Tailwind CSS** — utility-first styling that supports rapid visual polish and consistent theme control.
- **Zustand** — lightweight global state management for auth, bookings, and menu data.
- **Framer Motion** — performant animations for page entrances and hover transitions.

### Backend
- **Node.js + Express** — REST API server with structured controllers and middleware for authentication, bookings, and payments.
- **Stripe** — secure payment gateway for hosted checkout and verification.
- **Socket.IO** — bidirectional real-time messaging for booking notifications and admin updates.

### Database
- **MongoDB + Mongoose** — flexible document-oriented storage for users, reservations, venue bookings, reviews, and menu items.

### DevOps / Environment
- **dotenv** — runtime configuration of secrets and environment-specific values.
- **Nodemon** — automatic backend restart during development.
- **CORS** — configured for frontend/backend communication in local development.

### Architecture Flow

```text
Browser Client
      |
      | React + Zustand + Tailwind
      v
Frontend Routes / Forms
      |
      | Axios -> REST API
      v
Express Server
   |      |      \\
   |      |       \-- Socket.IO -> Browser Clients
   |      |
   |      +---> Stripe Checkout Session
   |      
   +---> MongoDB via Mongoose
```

---

## Getting Started / Installation

### Prerequisites
- Node.js 18+ / 20+
- npm 10+
- MongoDB Atlas or local MongoDB instance
- Stripe account for API keys

### Clone the repository

```bash
git clone <your-repo-url>
cd Restuarent_project
```

### Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Configure environment

Create `server/.env` with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
CLIENT_URL=http://localhost:5173
```

### Run the application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd ../client
npm run dev
```

Then visit the local frontend address shown by Vite.

---

## Deployment

For production deployment, build the frontend and host the resulting static assets on a platform such as Vercel, Netlify, or any static hosting service. Deploy the backend separately to a Node-compatible host like Heroku, Render, Railway, or a cloud VM.

Recommended steps:

- Set `NODE_ENV=production` and `PORT` in your backend environment.
- Use a production MongoDB URI (Atlas is recommended).
- Keep `STRIPE_SECRET_KEY` and `JWT_SECRET` secure.
- Update `CLIENT_URL` to the deployed frontend origin.

If you want a single deployment, serve the built frontend from the Express backend and configure CORS/use static middleware.

### Environment Variables for Deployment

**Backend (.env):**
```env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
CLIENT_URL=https://your-frontend-domain.com
PORT=5000
NODE_ENV=production
```

**Frontend (.env):**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

---

## Common Post-Deployment Issues & Fixes

### Issue: Login/Register Not Working

**Root Cause:** Frontend and backend are on different domains. Vite's proxy only works in development.

**Solution:** 
1. Create a `.env` file in `client/` with `REACT_APP_API_URL=https://your-backend-url/api`
2. Update backend `server/.env` with `CLIENT_URL=https://your-frontend-url`
3. Backend `server/server.js` CORS is now configured to allow specific origins

### Issue: Menu/Venue Data Not Loading

**Root Cause:** The database has not been seeded with menu items and private venues.

**Solution:** The database is **automatically seeded on server startup** if it's empty. 

After deployment to Render:
1. Push your latest code (which includes `server/utils/seedDB.js`)
2. Restart or redeploy on Render
3. Check Render logs - you'll see:
   ```
   🌱 Database is empty. Starting auto-seed...
   ✅ Seeded 16 menu items
   ✅ Seeded 6 private venues
   🎉 Database auto-seeding completed successfully!
   ```
4. Refresh your frontend - "From The Chef's Private Crucible" will now show menu items

**Manual seeding (if needed):** If auto-seeding doesn't work, you can manually trigger it:
```bash
curl -X POST https://dineverse-2kkb.onrender.com/api/seed
```

The auto-seed checks if data exists and only runs once, so it's safe to deploy multiple times.

### Issue: CORS Errors

**Root Cause:** Backend's CORS settings don't include your frontend domain.

**Solution:** Update `server/server.js` in the CORS configuration to include your frontend URL in `allowedOrigins`.

---

## Deep Dive: Challenges & Optimizations

### Payment verification and booking consistency
The core challenge was ensuring that bookings were only confirmed after Stripe payment succeeded. The solution was to create bookings with `paymentStatus: pending`, generate a Stripe checkout session server-side, then verify the payment session before updating the booking status to `confirmed`.

### Local development redirect handling
Stripe checkout redirects require a stable origin. To avoid port/host mismatch during development, the backend uses either `CLIENT_URL` or request-origin detection to build the `success_url` and `cancel_url` dynamically.

---

## Potential Interview Questions & Answers

| Question | Answer Outline (STAR) |
|---|---|
| Why did you choose Zustand instead of Redux for this project? | **S:** Needed shared state for auth/bookings without boilerplate. **T:** Keep state management lightweight and maintainable. **A:** Used Zustand for simple store logic and async actions. **R:** Fewer files, faster iteration, and sufficient global state support. |
| How did you secure the payment workflow end-to-end? | **S:** Checkout required authentication and validation. **T:** Prevent unauthorized bookings and ensure payment integrity. **A:** Added JWT-protected payment endpoints; created Stripe sessions server-side; verified payment on success. **R:** Secure payment flow, no premature booking confirmation. |
| How does the private dining booking flow work behind the scenes? | **S:** User selects a venue and submits booking details. **T:** Convert UI actions into a secure server-side transaction. **A:** Created the booking, then called Stripe session API, redirected user to Stripe, and verified the session callback. **R:** Complete booking lifecycle with payment gating. |
| Describe a blocking bug you fixed. | **S:** Vite failed to create temp config files on Windows. **T:** Identify cause and restore developer workflow. **A:** Found stale `.timestamp-*.mjs` lock issue, cleared temp files, checked permissions, and confirmed Vite startup. **R:** Local dev environment worked reliably again. |
| How would you scale this system for high traffic? | **S:** The app will require more traffic support. **T:** Design a scalable architecture. **A:** Use horizontal backend scaling, managed MongoDB cluster, caching for static menu data, and Stripe webhooks for async payment confirmation. **R:** Greater concurrency, reduced latency, and stronger reliability. |

> Use these questions to explain your decision-making, architecture, and debugging approach during interviews.

---

## Notes
- Replace placeholders like `[Insert Project Name]` and `[What does it do and why did you build it?]` with your actual project details.
- Keep the README updated with real deployment instructions and Stripe/DB environment values.
