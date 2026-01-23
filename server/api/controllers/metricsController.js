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

// Get chart data for dashboard (sales by month, orders by status)
exports.getChartData = async (req, res) => {
  try {
    // Get date 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Monthly sales and order count for last 6 months
    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $nin: ['cancelled', 'failed', 'refunded'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Generate labels and fill missing months with 0
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesData = [];
    const ordersData = [];
    const labels = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      labels.push(months[month - 1]);

      const found = monthlySales.find(
        item => item._id.year === year && item._id.month === month
      );

      salesData.push(found ? found.revenue : 0);
      ordersData.push(found ? found.orders : 0);
    }

    // Orders by status distribution
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Group into simplified categories for the doughnut chart
    const statusGroups = {
      'Completed': ['delivered', 'completed'],
      'Processing': ['pending payment', 'processing', 'on hold'],
      'Shipping': ['shipped', 'in transit', 'out for delivery'],
      'Cancelled': ['cancelled', 'failed', 'refunded']
    };

    const statusData = { Completed: 0, Processing: 0, Shipping: 0, Cancelled: 0 };

    ordersByStatus.forEach(item => {
      for (const [group, statuses] of Object.entries(statusGroups)) {
        if (statuses.includes(item._id)) {
          statusData[group] += item.count;
          break;
        }
      }
    });

    // Payment method distribution
    const paymentMethods = await Order.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 }
        }
      }
    ]);

    const paymentData = {};
    paymentMethods.forEach(item => {
      const label = item._id === 'cashOnDelivery' ? 'COD' :
                    item._id === 'onlinePayment' ? 'Online' : item._id;
      paymentData[label] = item.count;
    });

    res.status(200).json({
      monthlySales: {
        labels,
        revenue: salesData,
        orders: ordersData
      },
      ordersByStatus: statusData,
      paymentMethods: paymentData
    });
  } catch (error) {
    console.error('Error fetching chart data:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
