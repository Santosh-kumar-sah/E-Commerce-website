# Pro E-Commerce

## Features
- JWT Authentication (user & admin)
- MongoDB (Mongoose)
- Products: search, filters, pagination
- Cart: add / remove / get
- Orders: create with Stripe/Razorpay placeholders
- Admin dashboard: add/edit/delete products

## Setup
1. Copy `.env.example` → `.env` and fill values.
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:5000`

Notes:
- Integrate Stripe.js / Razorpay Checkout on frontend for payments.
- For admin: create a user and set `role: 'admin'` in DB or add promotion endpoint.
