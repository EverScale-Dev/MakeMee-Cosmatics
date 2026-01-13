const Order = require("../../models/Order");
const createInvoice = require("../../utils/createInvoice");
const sendEmail = require("../../utils/sendMail");

// GET /api/orders/:orderId/download-invoice
exports.downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId: Number(orderId) })
      .populate("customer")
      .populate("products.product");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Verify the order belongs to the logged-in user
    if (order.user && order.user.toString() !== req.User._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Generate invoice PDF
    const buffer = await createInvoice(order);

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Invoice_${order.orderId}.pdf`);
    res.setHeader("Content-Length", buffer.length);

    return res.send(buffer);
  } catch (error) {
    console.error("Download invoice error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate invoice" });
  }
};

// POST /api/orders/generate-invoice
exports.generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "orderId required" });
    }

    // Query by numeric/custom orderId to avoid ObjectId cast error
    const order = await Order.findOne({ orderId: Number(orderId) })
      .populate("customer")
      .populate("products.product");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check if invoice was already sent (prevent duplicate emails on page refresh)
    if (order.invoiceSent) {
      return res
        .status(200)
        .json({ success: true, message: "Invoice already sent", alreadySent: true });
    }

    // Generate invoice buffer
    let buffer;
    try {
      buffer = await createInvoice(order);
    } catch (err) {
      console.error("Invoice generation error:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Failed to generate invoice" });
    }

    // Send invoice to customer
    try {
      await sendEmail({
        email: order.customer.email,
        subject: "Your MakeMee Invoice",
        message: `Hi ${
          order.customer.fullName || ""
        },\n\nThank you for your order. Please find your invoice attached.\n\nRegards,\nMakeMee Cosmetics`,
        attachments: [
          {
            filename: `Invoice_${order.orderId}.pdf`,
            content: buffer,
          },
        ],
      });
    } catch (err) {
      console.error("Error sending invoice email:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send invoice email" });
    }

    // Mark invoice as sent to prevent duplicate emails
    order.invoiceSent = true;
    await order.save();

    // Send notification to admin
    try {
      const productsList = order.products
        .map((item, index) => {
          const { name, price, quantity } = item;
          return `#${
            index + 1
          }\nProduct Name: ${name}\nQuantity: ${quantity}\nPrice per Unit: ₹${price.toFixed(
            2
          )}\nSubtotal: ₹${(price * quantity).toFixed(2)}`;
        })
        .join("\n\n");

      await sendEmail({
        email: process.env.Admin_Email_Id,
        subject: `🧾 New Order Received — Order #${order.orderId}`,
        message: `📦 **New Order Notification**

A new order has been successfully placed on MakeMee Cosmetics.

━━━━━━━━━━━━━━━━━━━━━━
🆔 Order ID: ${order.orderId}
👤 Customer Name: ${order.customer.fullName}
✉️ Email: ${order.customer.email}
📞 Contact: ${order.customer.phone || "N/A"}
💰 Total Amount: ₹${order.totalAmount.toFixed(2)}
🕒 Order Date: ${new Date(order.createdAt).toLocaleString("en-IN")}
━━━━━━━━━━━━━━━━━━━━━━

🛍️ **Order Details:**
${productsList}

━━━━━━━━━━━━━━━━━━━━━━
📝 **Customer Note:**
${order.note || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━`,
      });
    } catch (err) {
      console.error("Error sending admin email:", err.message);
      // Don't block customer response
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Invoice generated & emailed to customer",
      });
  } catch (error) {
    console.error("Invoice endpoint error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
