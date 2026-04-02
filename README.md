# Nexus Premium Tech eCommerce

![Nexus Premium Tech](https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000)

A fully functional, modern, and responsive eCommerce web application built with a focus on stunning aesthetics, glassmorphism, and a sleek dark-mode UI.

**👉 Live Demo:** [https://iridescent-granita-26e154.netlify.app/](https://iridescent-granita-26e154.netlify.app/)

## ✨ Features

- **Modern UI/UX:** Responsive design with glassmorphism, gradient text, and micro-animations.
- **Dynamic Product Catalog:** Products populated dynamically using Vanilla JavaScript.
- **Shopping Cart System:** Add to cart, adjust quantities, and calculate totals in real-time.
- **Secure Checkout Integration:** Built-in connection to Razorpay for handling payments (currently mock/test mode).
- **Admin Dashboard:** Manage products and orders with a dedicated admin interface.
- **Backend Ready:** Prepared for Supabase integration (Auth & Database) for production deployment.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Vanilla, CSS Variables, Flexbox/Grid), Vanilla JavaScript (ES6 Modules)
- **Backend (Configured for):** Supabase (PostgreSQL, Realtime, Auth)
- **Payment Gateway:** Razorpay JS API

## 🚀 Getting Started

To run this project locally:

1. Clone the repository.
2. Open `index.html` in your web browser, or serve it using a local development server (e.g., Live Server extension in VS Code).
3. (Optional) Check the `supabase` folder for the SQL schema to initialize your own Supabase project.

## 🔐 Notes on Security (API Keys)

If you are viewing the source code, you may notice API keys in `js/supabase.js` and `js/payment.js`. 

- **Supabase Anon Key:** The `SUPABASE_ANON_KEY` is purposefully meant to be public in standard frontend applications. Security is enforced through **Row Level Security (RLS)** policies configured on the backend database, ensuring users can only access data they are authorized to see.
- **Razorpay Key ID:** The `RAZORPAY_KEY_ID` (starts with `rzp_test_...`) is a public identifier used for launching the checkout UI. The sensitive `RAZORPAY_SECRET_KEY` is completely secure and is never exposed in the front-end code.

---
*Built with ❤️ for a premium eCommerce experience.*
