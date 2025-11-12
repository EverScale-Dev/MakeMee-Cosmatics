const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Customer = require("../../models/Customer");
const createInvoice = require("../../utils/createInvoice");
const sendEmail = require("../../utils/sendMail");

// =========================================================
// @desc    Create a new order
// @route   POST /api/orders
// =========================================================
exports.createOrder = async (req, res) => {
  const { customer, products, totalAmount, paymentMethod, note } = req.body;

  try {
    // ✅ Check if the customer exists
    const existingCustomer = await Customer.findById(customer);
    if (!existingCustomer) {
      return res.status(400).json({ message: "Customer does not exist" });
    }

    // ✅ Validate and format product data
    const validatedProducts = [];
    for (let item of products) {
      const productId = item.product;
      const existingProduct = await Product.findById(productId);

      if (!existingProduct) {
        return res.status(400).json({
          message: `Product with ID ${productId} does not exist`,
        });
      }

      validatedProducts.push({
        product: productId,
        quantity: item.quantity,
        name: existingProduct.name,
        price: item.price || existingProduct.salePrice,
      });
    }

    // ✅ Create new order
    const order = await Order.create({
      customer,
      products: validatedProducts,
      totalAmount,
      paymentMethod,
      note,
    });

    // ✅ Populate for email & invoice
    const populatedOrder = await Order.findById(order._id)
      .populate("customer")
      .populate("products.product");

    // ✅ Generate Invoice PDF
    let buffer;
    try {
      buffer = await createInvoice(populatedOrder);
    } catch (error) {
      console.error("Error generating invoice:", error.message);
      return res.status(500).json({ message: "Failed to generate invoice" });
    }

    // ✅ Send Invoice Email to Customer
    try {
      await sendEmail({
        email: existingCustomer.email,
        subject: "Order Confirmation & Invoice",
        message: `Thank you for shopping with MakeMee.\n\nYour order has been successfully confirmed and is now being prepared with care!\n\nWe’ll notify you as soon as it’s shipped.\n\nGet ready to enhance your glow your MakeMee products are on their way!`,
        attachments: [
          {
            filename: `Invoice_${order._id}.pdf`,
            content: buffer,
          },
        ],
      });
    } catch (error) {
      console.error("Error sending email to user:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to send invoice email to the customer" });
    }

    // ✅ Send Email Notification to Admin
    try {
      const productsList = populatedOrder.products
        .map((item, index) => {
          const { name, price, quantity } = item;
          return `#${index + 1}
          Product Name: ${name}
          Quantity: ${quantity}
          Price per Unit: ₹${price.toFixed(2)}
          Subtotal: ₹${(price * quantity).toFixed(2)}`;
        })
        .join("\n\n");

      await sendEmail({
        email: process.env.Admin_Email_Id,
        subject: `🧾 New Order Received — Order #${order._id}`,
        message: `📦 **New Order Notification**

        A new order has been successfully placed on MakeMee Cosmetics.

        ━━━━━━━━━━━━━━━━━━━━━━
        🆔 Order ID: ${order._id}
        👤 Customer Name: ${existingCustomer.fullName}
        ✉️ Email: ${existingCustomer.email}
        📞 Contact: ${existingCustomer.phone || "N/A"}
        💰 Total Amount: ₹${order.totalAmount.toFixed(2)}
        🕒 Order Date: ${new Date(order.createdAt).toLocaleString("en-IN")}
        ━━━━━━━━━━━━━━━━━━━━━━

        🛍️ **Order Details:**
        ${productsList}

        ━━━━━━━━━━━━━━━━━━━━━━
        📝 **Customer Note:**
        ${order.note || "N/A"}

        ━━━━━━━━━━━━━━━━━━━━━━
        Thank you,
        MakeMee Cosmetics Team
        support@makemee.com
        www.makemee.com
        ━━━━━━━━━━━━━━━━━━━━━━`,
      });
    } catch (error) {
      console.error("Error sending email to admin:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to send notification email to the admin" });
    }

    // ✅ Send Response
    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================
// @desc    Get all orders (Paginated)
// @route   GET /api/orders
// =========================================================
exports.getAllOrders = async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("customer", "fullName email")
      .populate("products.product")
      .limit(Number(limit))
      .skip(Number(skip));

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      totalOrders,
      orders: orders.map((order) => ({
        _id: order._id,
        orderId: order.orderId,
        customer: order.customer,
        products: order.products,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        note: order.note,
        isViewed: order.isViewed,
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================================================
// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// =========================================================
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id)
      .populate("customer", "fullName email phone shippingAddress")
      .populate("products.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.isViewed) {
      order.isViewed = true;
      await order.save();
    }

    res.status(200).json({
      _id: order._id,
      orderId: order.orderId,
      customer: order.customer,
      products: order.products,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      note: order.note,
      isViewed: order.isViewed,
    });
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================================================
// @desc    Update an order status
// @route   PUT /api/orders/:id
// =========================================================
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending payment",
    "processing",
    "on hold",
    "completed",
    "refunded",
    "cancelled",
    "failed",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      _id: order._id,
      orderId: order.orderId,
      customer: order.customer,
      products: order.products,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================
// @desc    Delete an order
// @route   DELETE /api/orders/:id
// =========================================================
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(204).json({ message: "Order Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
