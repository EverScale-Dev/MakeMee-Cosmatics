const Order = require("../../models/Order");
const Product = require("../../models/Product");

const Customer = require("../../models/Customer");
const createInvoice = require("../../utils/createInvoice");
const sendEmail = require("../../utils/sendMail");

// @desc    Create a new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  const { customer, products, totalAmount, paymentMethod, note } =
    req.body;

  try {
    // Check if the customer exists
    const existingCustomer = await Customer.findById(customer);
    if (!existingCustomer) {
      return res.status(400).json({ message: "Customer does not exist" });
    }
    // Initialize an empty array to hold the updated products with productModel
    const updatedProducts = [];

    // Loop through each product to check and assign the productModel
    for (let item of products) {
      const productId = item.product; // Extract product ID
      let productModel;

      // Check if the product exists in the Product collection
      const existingProduct = await Product.findById(productId);
      if (existingProduct) {
        productModel = "Product";
      } else {
        // If not found in Product, check the CustomProduct collection
        const existingCustomProduct = await CustomProduct.findById(productId);
        if (existingCustomProduct) {
          productModel = "CustomProduct";
        }
      }

      // If neither Product nor CustomProduct was found, return an error
      if (!productModel) {
        return res.status(400).json({
          message: `Product with ID ${productId} does not exist in Product or CustomProduct collections`,
        });
      }

      // Add the product to the updatedProducts array with the correct productModel
      updatedProducts.push({
        product: productId,
        productModel: productModel,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
      });
    }

    // Create a new order
    const order = await Order.create({
      customer,
      products: updatedProducts,
      totalAmount,
      paymentMethod,
      note
    });

    // Optionally, fetch the complete order data with populated fields
    const populatedOrder = await Order.findById(order._id)
      .populate("customer")
      .populate({
        path: "products.product",
        refPath: "products.productModel",
      });

    // Log the populated order data
    // console.log("Populated Order:", populatedOrder);
    // console.log("Products in Order:", populatedOrder.products);
    // console.log("Customer in Order:", populatedOrder.customer);

    // let buffer;
    try {
      // Generate invoice as a PDF buffer
      buffer = await createInvoice(populatedOrder); // Now returns a buffer
    } catch (error) {
      console.error("Error generating invoice:", error.message);
      return res.status(500).json({ message: "Failed to generate invoice" });
    }

    // Send email to the user with the invoice
    try {
      await sendEmail({
        email: existingCustomer.email,
        subject: "Order Confirmation & Invoice",
        message: `Dear ${existingCustomer.fullName},\n\nThank you for your order! Please find your invoice attached.\n\nRegards,\nKwality Ecom Team`,
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

    try {
      // Format products for email message
      const productsList = populatedOrder.products
        .map((item) => {
          const { name, price, quantity } = item;
          return `
     Product Name: ${name}
     Quantity: ${quantity}
     Price per Unit: ₹${price.toFixed(2)}
     Total: ₹${(price * quantity).toFixed(2)}
   `;
        })
        .join("\n\n");

      await sendEmail({
        email: process.env.Admin_Email_Id,
        subject: "New Order Created",
        message: `A new order (Order #${order._id}) has been placed by ${
          existingCustomer.fullName
        }.
      \n\nOrder Details:
      \nTotal Amount: ₹${order.totalAmount.toFixed(2)}
      \n\nProducts:\n${productsList}
      \n\nNote:\n${order.note}
      \n\nThank you,
      \nKwality Ecom Team `,
      });
    } catch (error) {
      console.error("Error sending email to admin:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to send notification email to the admin" });
    }

    // Respond with the created order
    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder
    });

  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    // Get pagination and search parameters from the request query
    const { limit = 10, skip = 0 } = req.query;

    const orders = await Order.find()
      .sort({ createdAt: -1 }) // Sort orders in reverse (latest first)
      .populate("customer", "fullName email") // Populate customer details
      .populate({
        path: "products.product",
        refPath: "products.productModel",
      }) // Populate product details
      .limit(Number(limit)) // Limit the number of orders returned
      .skip(Number(skip)); // Skip the first N results

    // Get the total count of orders for pagination
    const totalOrders = await Order.countDocuments();

    // Return the orders and total count in the response
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

// @desc    Get a single order by ID
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id)
      .populate("customer", "fullName email phone shippingAddress") // Populate customer details
      .populate({
        path: "products.product",
        refPath: "products.productModel",
      }); // Populate product details

    // console.log("getOrderById", order.products);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.isViewed) {
      order.isViewed = true;
      await order.save(); // Save the updated order with isViewed = true
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

// @desc    Update an order
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate the status
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
      { new: true, runValidators: true } // Return the updated order and validate input
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the updated order details
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
    res.status(500).json({ message: "Server error", error: error.message }); // Include the error message for debugging
  }
};

// @desc    Delete an order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(204).json({ message: "Order Deleted Successfully" }); // No content to return on successful delete
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
