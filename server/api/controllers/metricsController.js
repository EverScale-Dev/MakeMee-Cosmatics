const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Customer = require('../../models/Customer');

exports.getMetrics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    res.status(200).json({
      totalOrders,
      totalProducts,
      totalCustomers,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0
    });
  } catch (error) {
    console.error('Error fetching metrics:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
