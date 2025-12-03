const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const customerRoutes = require('./routes/customer');
const metricsRoutes = require('./routes/metrics');
const loggerMiddleware = require('../middlewares/logger');
const paymentRoutes = require("./routes/payment");
const shiprocketRoutes = require('./routes/shiprocketRoutes');
const contactRoutes = require('./routes/contactRoutes');

dotenv.config();
connectDB();

const app = express();

// ✅ FIXED CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://makemee.in",
      "https://www.makemee.in"   // optional but recommended
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Required for some browsers to avoid CORS issues
app.options("*", cors());

app.use(express.json());

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


app.get('/', (req, res) => {
  res.send('Hello, MakeMeeCosmetics Server!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
