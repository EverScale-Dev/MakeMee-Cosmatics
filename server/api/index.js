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
const porterRoutes = require('./routes/porter'); 
const loggerMiddleware = require('../middlewares/logger');
const paymentRoutes = require("./routes/payment");
const shiprocketRoutes = require('./routes/shiprocketRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true             
}));
app.use(express.json());

// Apply logger middleware only in development
if (process.env.NODE_ENV === 'development') {
  app.use(loggerMiddleware);
}
// Serve uploaded images as static files
app.use("/uploads", express.static("public/uploads"));


// Routes
app.use('/auth', authRoutes);           // Auth routes
app.use('/products', productRoutes);    // Product routes
app.use('/orders', orderRoutes);        // Order routes
app.use('/customers', customerRoutes);  // Customers
app.use('/metrics', metricsRoutes);     // Metrics routes
app.use('/porter', porterRoutes);     // Porter routes
app.use('/payment', paymentRoutes);  // Payment routes
app.use('/shiprocket', shiprocketRoutes); // Shiprocket routes

app.get('/', (req, res) => {
  res.send('Hello, MakeMeeCosmetics Server!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
