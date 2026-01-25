const express = require('express');
const dotenv = require('dotenv');

// Load env vars FIRST before any other imports
dotenv.config();

const connectDB = require('../config/db');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Import routes (after env vars are loaded)
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const customerRoutes = require('./routes/customer');
const metricsRoutes = require('./routes/metrics');
const loggerMiddleware = require('../middlewares/logger');
const paymentRoutes = require("./routes/payment");
const shiprocketRoutes = require('./routes/shiprocketRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes = require("./routes/reviewRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const cartRoutes = require("./routes/cart");
const couponRoutes = require("./routes/couponRoutes");
const bannerRoutes = require("./routes/bannerRoutes");

connectDB();

const app = express();

// Trust proxy (needed for rate-limiter behind nginx)
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to load cross-origin
}));

// Compression for responses
app.use(compression());

// ✅ FIXED CORS
app.use(
  cors({
    origin: [
      "https://makemee.in",
      "https://www.makemee.in",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",  // admin panel local
      "https://admin.makemee.in"  // admin panel production
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  })
);

// Required for some browsers to avoid CORS issues
app.options("*", cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logger only in dev
if (process.env.NODE_ENV === 'development') {
  app.use(loggerMiddleware);
}

// Static files
app.use("/uploads", express.static("public/uploads"));

// Routes (updated)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/shiprocket', shiprocketRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/banners", bannerRoutes);

app.get('/', (req, res) => {
  res.send('Hello, MakeMeeCosmetics Server!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler - must be last
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message,
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
