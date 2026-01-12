# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MakeMee-Cosmatics is a full-stack e-commerce platform for cosmetics products built with Next.js 14 (frontend) and Express.js (backend) with MongoDB.

## Development Commands

### Frontend (client/)
```bash
cd client
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend (server/)
```bash
cd server
npm run dev      # Start with nodemon on port 5000
npm run start    # Production server
```

### Running Both
Start the backend first (port 5000), then the frontend (port 3000). The frontend proxies API requests to the backend.

## Architecture

### Frontend Structure (client/src/)
- **app/**: Next.js App Router with file-based routing
  - Dynamic routes: `products/[id]`, `orderInvoice/[id]`
  - Auth routes grouped under `(auth)/`
  - Admin dashboard at `/admin`
- **store/slices/cartSlice.js**: Redux Toolkit cart state with localStorage persistence
- **utils/axiosClient.js**: Configured axios instance for API calls
- **context/LoadingProvider.js**: Global loading state context

### Backend Structure (server/)
- **api/index.js**: Express app entry point with all route mounting
- **api/routes/**: Route definitions (auth, products, orders, customers, payment, shiprocket, delivery, review, contact, metrics)
- **api/controllers/**: Business logic handlers
- **models/**: Mongoose schemas (User, Product, Order, Customer, Review, DeliveryCharges)
- **middlewares/**: protect.js (JWT auth), upload.js (Multer for images), logger.js
- **utils/**: sendMail.js, createInvoice.js (PDFKit), shiprocket.js

### API Routes
All routes prefixed with `/api/`:
- `/auth` - User authentication (JWT-based)
- `/products` - Product CRUD
- `/orders` - Order management
- `/customers` - Customer data
- `/payment` - Razorpay integration
- `/shiprocket` - Shipping calculations
- `/delivery` - Delivery tracking
- `/review` - Product reviews

### Data Models

**Product**: name, brand, regularPrice, salePrice, images[], weight, features, ingredients[], rating (0-5), badge (NEW LAUNCH, BEST SELLER, etc.)

**Order**: Auto-incremented orderId, customer ref, products array with snapshots, paymentMethod (cashOnDelivery, onlinePayment, etc.), status (pending payment, processing, completed, refunded, cancelled, failed)

**User**: Email-based auth with JWT tokens

### State Management
Redux Toolkit with cart slice:
- Cart items persist to localStorage
- SSR-safe (checks for browser environment before localStorage access)
- Actions: addToCart, removeFromCart, clearCart

## Key Integrations
- **Payments**: Razorpay
- **Shipping**: Shiprocket API
- **Images**: Cloudinary (max 5 images per upload)
- **Email**: Nodemailer
- **Analytics**: Google Tag Manager (GTM-MWCZ223N)

## Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps key

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `SMTP_*`: Email credentials
- `RAZORPAY_*`: Payment credentials
- `SHIPROCKET_*`: Shipping credentials
- `CLOUDINARY_*`: Image storage credentials
