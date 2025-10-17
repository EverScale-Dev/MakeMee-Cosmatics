const Order = require("../../models/Order");
const {
  createOrder,
  assignAwb,
  generateLabel,
  trackByAwb,
} = require("../../utils/shiprocket");

exports.shipOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate(
      "customer",
      "fullName email phone shippingAddress"
    ); // Populate customer details
    if (!order) return res.status(404).json({ error: "Order not found" });

    // console.log("order detail",order)
    const srOrder = await createOrder({
      order_id: order?.orderId.toString(),
      order_date: new Date(order.createdAt)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      pickup_location: "primary",

      // Billing / Shipping Details
      billing_customer_name:
        order.customer?.fullName || order.customer?.name || "Unknown",
      billing_last_name: "",
      billing_address: `${
        order.customer?.shippingAddress?.apartment_address || ""
      }
      
      
      
      , ${order.customer?.shippingAddress?.street_address1 || ""}`,
      billing_address_2: "",
      billing_city: order.customer?.shippingAddress?.city || "",
      billing_pincode: order.customer?.shippingAddress?.pincode || "",
      billing_state: order.customer?.shippingAddress?.state || "",
      billing_country: "India",
      billing_email: order.customer?.email || "",
      billing_phone: order.customer?.phone || "",

      // If shipping address is same as billing
      shipping_is_billing: true,

      // Order Items
      order_items: (order.products || order.items || []).map((item, idx) => ({
        name: item.name || `Item-${idx + 1}`,
        sku: item.sku || `SKU-${idx + 1}`,
        units: item.quantity || 1,
        selling_price: item.price || 0,
        discount: 0,
        tax: 0,
        hsn: item.hsn || "0000",
      })),

      // Payment & Price
      payment_method: "Prepaid", // or 'COD'
      sub_total: order.totalAmount || order.subTotal || 0,

      // Dimensions & Weight
      weight: order.totalWeight || 0.5,
      length: order.dimensions?.length || 10,
      breadth: order.dimensions?.breadth || 10,
      height: order.dimensions?.height || 10,

      // Optional Charges
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
    });

    const shipmentId = srOrder.shipment_id;

    order.shiprocket = {
      shipmentId,
    };

    await order.save();

    res.json({
      message: "Order shipped",
      shiprocket: order.shiprocket,
    });
  } catch (error) {
    console.error("Shiprocket Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to ship order" });
  }
};

exports.trackOrder = async (req, res) => {
  try {
    const awb = req.params.awb;
    const result = await trackByAwb(awb);
    res.json(result);
  } catch (err) {
    console.error("Tracking Error:", err);
    res.status(500).json({ error: "Failed to track shipment" });
  }
};
