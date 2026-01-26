const Order = require("../../models/Order");
const {
  createOrder,
  assignAwb,
  generateLabel,
  trackByAwb,
  trackByShipmentId,
  getPickupLocations,
  ShiprocketError,
} = require("../../utils/shiprocket");

// AWB error classification helper
function classifyAwbError(error) {
  const message = (error.message || "").toLowerCase();
  const details = error.details || {};
  const detailsStr = JSON.stringify(details).toLowerCase();

  // Check for specific error patterns
  if (message.includes("unauthorized") || detailsStr.includes("unauthorized") ||
      message.includes("permission") || detailsStr.includes("permission")) {
    return {
      code: "UNAUTHORIZED",
      message: "Account does not have permission for AWB assignment. Contact Shiprocket support.",
      isRetryable: false,
    };
  }

  if (message.includes("cod") && (message.includes("not enabled") || message.includes("disabled"))) {
    return {
      code: "COD_NOT_ENABLED",
      message: "COD is not enabled for this courier. Enable COD in Shiprocket dashboard.",
      isRetryable: false,
    };
  }

  if (message.includes("courier") && (message.includes("not available") || message.includes("unavailable"))) {
    return {
      code: "COURIER_UNAVAILABLE",
      message: "No courier available for this route. Try again later or contact Shiprocket.",
      isRetryable: true,
    };
  }

  if (message.includes("serviceable") || message.includes("pincode")) {
    return {
      code: "NOT_SERVICEABLE",
      message: "Pickup or delivery location not serviceable by available couriers.",
      isRetryable: false,
    };
  }

  if (message.includes("weight") || message.includes("dimension")) {
    return {
      code: "INVALID_DIMENSIONS",
      message: "Package weight or dimensions invalid for available couriers.",
      isRetryable: false,
    };
  }

  // Default: unknown error, may be retryable
  return {
    code: "AWB_ASSIGNMENT_FAILED",
    message: error.message || "AWB assignment failed for unknown reason.",
    isRetryable: true,
  };
}

// Validation helper
function validateOrderForShipping(order) {
  const errors = [];
  const customer = order.customer;
  const address = customer?.shippingAddress;

  // Customer validation
  if (!customer) {
    errors.push("Customer information is missing");
  } else {
    if (!customer.fullName) errors.push("Customer name is required");
    if (!customer.phone) errors.push("Customer phone is required");
    if (!customer.email) errors.push("Customer email is required");
  }

  // Address validation
  if (!address) {
    errors.push("Shipping address is missing");
  } else {
    if (!address.street_address1 && !address.apartment_address) {
      errors.push("Street address is required");
    }
    if (!address.city) errors.push("City is required");
    if (!address.state) errors.push("State is required");
    if (!address.pincode) errors.push("Pincode is required");
  }

  // Products validation
  if (!order.products || order.products.length === 0) {
    errors.push("Order must have at least one product");
  }

  return errors;
}

// Build Shiprocket order payload
function buildShiprocketPayload(order, pickupLocation) {
  const customer = order.customer;
  const address = customer.shippingAddress;

  // Build address string
  const addressParts = [];
  if (address.apartment_address) addressParts.push(address.apartment_address);
  if (address.street_address1) addressParts.push(address.street_address1);
  const fullAddress = addressParts.join(", ") || "N/A";

  // Determine payment method
  const isCOD = order.paymentMethod === "cashOnDelivery";

  return {
    order_id: order.orderId.toString(),
    order_date: new Date(order.createdAt).toISOString().slice(0, 19).replace("T", " "),
    pickup_location: pickupLocation,

    // Billing details
    billing_customer_name: customer.fullName.split(" ")[0] || "Customer",
    billing_last_name: customer.fullName.split(" ").slice(1).join(" ") || "",
    billing_address: fullAddress,
    billing_address_2: address.street_address2 || "",
    billing_city: address.city,
    billing_pincode: String(address.pincode),
    billing_state: address.state,
    billing_country: "India",
    billing_email: customer.email,
    billing_phone: String(customer.phone).replace(/\D/g, "").slice(-10),

    // Shipping same as billing
    shipping_is_billing: true,

    // Order items
    order_items: order.products.map((item, idx) => ({
      name: item.name || `Product ${idx + 1}`,
      sku: item.product?.sku || `SKU-${order.orderId}-${idx + 1}`,
      units: item.quantity || 1,
      selling_price: item.price || 0,
      discount: 0,
      tax: 0,
      hsn: item.product?.hsn || "",
    })),

    // Payment
    payment_method: isCOD ? "COD" : "Prepaid",
    sub_total: order.totalAmount - (order.deliveryCharge || 0),

    // Package dimensions (defaults for cosmetics)
    weight: 0.5,
    length: 15,
    breadth: 10,
    height: 5,

    // Optional charges
    shipping_charges: order.deliveryCharge || 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
  };
}

// Map Shiprocket status to order status
function mapShipmentStatus(shiprocketStatus) {
  const statusMap = {
    "PICKUP SCHEDULED": "processing",
    "PICKUP GENERATED": "processing",
    "PICKED UP": "shipped",
    "IN TRANSIT": "in transit",
    "OUT FOR DELIVERY": "out for delivery",
    "DELIVERED": "delivered",
    "RTO INITIATED": "processing",
    "RTO DELIVERED": "cancelled",
    "CANCELLED": "cancelled",
  };
  // Ensure shiprocketStatus is a string before calling toUpperCase
  const status = typeof shiprocketStatus === 'string' ? shiprocketStatus.toUpperCase() : null;
  return status ? (statusMap[status] || null) : null;
}

/**
 * POST /api/shiprocket/ship/:id
 * Create shipment for an order
 */
exports.shipOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Fetch order with customer details
    const order = await Order.findById(orderId).populate(
      "customer",
      "fullName email phone shippingAddress"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // IDEMPOTENCY: Check if shipment already exists
    if (order.shiprocket?.shipmentId) {
      console.log(`[Shiprocket] Order ${order.orderId} already has shipment`);
      return res.json({
        success: true,
        message: "Shipment already exists for this order",
        shiprocket: order.shiprocket,
        alreadyExists: true,
      });
    }

    // CRITICAL: Block shipment creation for unpaid online orders
    if (order.paymentMethod === "onlinePayment" && order.paymentStatus !== "paid") {
      console.log(`[Shiprocket] Blocked shipment for unpaid online order ${order.orderId}`);
      return res.status(400).json({
        success: false,
        error: "Cannot create shipment for unpaid online order",
        details: "Online payment orders require payment verification before shipping",
        paymentStatus: order.paymentStatus,
      });
    }

    // Block shipment creation for cancelled/refunded/failed orders
    const nonShippableStatuses = ["cancelled", "refunded", "failed"];
    if (nonShippableStatuses.includes(order.status)) {
      console.log(`[Shiprocket] Blocked shipment for ${order.status} order ${order.orderId}`);
      return res.status(400).json({
        success: false,
        error: `Cannot create shipment for ${order.status} order`,
        details: "This order cannot be shipped due to its current status",
        orderStatus: order.status,
      });
    }

    // Validate order data
    const validationErrors = validateOrderForShipping(order);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationErrors,
      });
    }

    // Get pickup locations
    let pickupLocations;
    try {
      pickupLocations = await getPickupLocations();
    } catch (err) {
      console.error("[Shiprocket] Failed to get pickup locations:", err.message);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch pickup locations from Shiprocket",
        isTemporary: err.isTemporary || true,
      });
    }

    if (!pickupLocations || pickupLocations.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No pickup locations configured in Shiprocket. Please add a pickup address in your Shiprocket dashboard.",
      });
    }

    const pickupLocation = pickupLocations[0]?.pickup_location;
    if (!pickupLocation) {
      return res.status(400).json({
        success: false,
        error: "Invalid pickup location configuration in Shiprocket",
      });
    }

    // Build payload
    const payload = buildShiprocketPayload(order, pickupLocation);

    // Step 1: Create Shiprocket order
    let srOrder;
    try {
      srOrder = await createOrder(payload);
    } catch (err) {
      console.error("[Shiprocket] Order creation failed:", err.message, err.details);
      return res.status(500).json({
        success: false,
        error: `Failed to create Shiprocket order: ${err.message}`,
        isTemporary: err.isTemporary || false,
        details: err.details,
      });
    }

    if (!srOrder.shipment_id) {
      console.error("[Shiprocket] No shipment_id in response:", srOrder);
      return res.status(500).json({
        success: false,
        error: "Shiprocket did not return a shipment ID",
        details: srOrder,
      });
    }

    // Initialize shiprocket data with pending_awb status
    order.shiprocket = {
      orderId: String(srOrder.order_id),
      shipmentId: String(srOrder.shipment_id),
      pickupLocation: pickupLocation,
      createdAt: new Date(),
      status: "pending_awb",  // Start with pending_awb
      awbRetryCount: 0,
    };

    // CRITICAL: Save shipmentId to DB IMMEDIATELY (before AWB attempt)
    // This ensures we never lose the shipment even if AWB fails
    await order.save();
    console.log(`[Shiprocket] Shipment ${srOrder.shipment_id} saved to DB for order ${order.orderId}`);

    // Step 2: Attempt AWB assignment (may fail due to account permissions)
    let awbResult;
    let awbError = null;
    try {
      order.shiprocket.lastAwbAttempt = new Date();
      order.shiprocket.awbRetryCount = 1;

      awbResult = await assignAwb(srOrder.shipment_id);

      if (awbResult.response?.data?.awb_code) {
        order.shiprocket.awb = awbResult.response.data.awb_code;
        order.shiprocket.courierName = awbResult.response.data.courier_name;
        order.shiprocket.courierCompanyId = awbResult.response.data.courier_company_id;
        order.shiprocket.status = "ready";
        order.shiprocket.awbError = null;
        order.shiprocket.awbErrorCode = null;
        console.log(`[Shiprocket] AWB assigned: ${order.shiprocket.awb}`);
      } else if (awbResult.awb_code) {
        order.shiprocket.awb = awbResult.awb_code;
        order.shiprocket.courierName = awbResult.courier_name;
        order.shiprocket.courierCompanyId = awbResult.courier_company_id;
        order.shiprocket.status = "ready";
        order.shiprocket.awbError = null;
        order.shiprocket.awbErrorCode = null;
      } else {
        // AWB response didn't contain expected data
        awbError = classifyAwbError({ message: "AWB response missing awb_code", details: awbResult });
        order.shiprocket.awbError = awbError.message;
        order.shiprocket.awbErrorCode = awbError.code;
        console.warn(`[Shiprocket] AWB response unexpected:`, awbResult);
      }
    } catch (err) {
      // Classify the error for admin visibility
      awbError = classifyAwbError(err);
      order.shiprocket.status = "pending_awb";
      order.shiprocket.awbError = awbError.message;
      order.shiprocket.awbErrorCode = awbError.code;
      console.error(`[Shiprocket] AWB assignment failed (${awbError.code}):`, err.message);
      // DO NOT throw - continue with partial success
    }

    // Step 3: Generate label (only if AWB was assigned)
    if (order.shiprocket.awb) {
      try {
        const labelResult = await generateLabel(srOrder.shipment_id);
        if (labelResult.label_url) {
          order.shiprocket.labelUrl = labelResult.label_url;
          console.log(`[Shiprocket] Label generated: ${order.shiprocket.labelUrl}`);
        }
      } catch (err) {
        console.error("[Shiprocket] Label generation failed:", err.message);
        // Continue without label - it can be generated later
      }

      // Build tracking URL
      order.shiprocket.trackingUrl = `https://shiprocket.co/tracking/${order.shiprocket.awb}`;
      order.shiprocket.shipmentStatus = "PICKUP SCHEDULED";
      order.status = "processing";
    }

    // Save final state
    await order.save();

    // Determine response based on AWB status
    const isPartialSuccess = !order.shiprocket.awb && order.shiprocket.shipmentId;

    res.json({
      success: true,
      partialSuccess: isPartialSuccess,
      message: order.shiprocket.awb
        ? "Shipment created and AWB assigned successfully"
        : `Shipment created but AWB pending: ${awbError?.message || "Unknown error"}`,
      shiprocket: order.shiprocket,
      awbError: awbError ? {
        code: awbError.code,
        message: awbError.message,
        isRetryable: awbError.isRetryable,
      } : null,
    });
  } catch (error) {
    console.error("[Shiprocket] shipOrder error:", error);

    if (error instanceof ShiprocketError) {
      return res.status(500).json({
        success: false,
        error: error.message,
        code: error.code,
        isTemporary: error.isTemporary,
        details: error.details,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create shipment",
      details: error.message,
    });
  }
};

/**
 * POST /api/shiprocket/assign-awb/:id
 * Assign AWB to an existing shipment (retry)
 * This endpoint is specifically for retrying AWB assignment when initial attempt failed
 */
exports.assignAwbToOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    if (!order.shiprocket?.shipmentId) {
      return res.status(400).json({
        success: false,
        error: "No shipment exists for this order. Create shipment first.",
      });
    }

    // Check if AWB is already assigned
    if (order.shiprocket.awb) {
      return res.json({
        success: true,
        message: "AWB already assigned",
        awb: order.shiprocket.awb,
        courierName: order.shiprocket.courierName,
        alreadyExists: true,
      });
    }

    // Update retry count and attempt time
    order.shiprocket.awbRetryCount = (order.shiprocket.awbRetryCount || 0) + 1;
    order.shiprocket.lastAwbAttempt = new Date();

    let awbError = null;

    try {
      const awbResult = await assignAwb(order.shiprocket.shipmentId);

      if (awbResult.response?.data?.awb_code || awbResult.awb_code) {
        // SUCCESS: AWB assigned
        order.shiprocket.awb = awbResult.response?.data?.awb_code || awbResult.awb_code;
        order.shiprocket.courierName = awbResult.response?.data?.courier_name || awbResult.courier_name;
        order.shiprocket.courierCompanyId = awbResult.response?.data?.courier_company_id || awbResult.courier_company_id;
        order.shiprocket.trackingUrl = `https://shiprocket.co/tracking/${order.shiprocket.awb}`;
        order.shiprocket.status = "ready";
        order.shiprocket.shipmentStatus = "PICKUP SCHEDULED";
        order.shiprocket.awbError = null;
        order.shiprocket.awbErrorCode = null;
        order.status = "processing";

        // Try to generate label
        try {
          const labelResult = await generateLabel(order.shiprocket.shipmentId);
          if (labelResult.label_url) {
            order.shiprocket.labelUrl = labelResult.label_url;
          }
        } catch (labelErr) {
          console.error("[Shiprocket] Label generation failed on retry:", labelErr.message);
        }

        await order.save();

        console.log(`[Shiprocket] AWB assigned on retry #${order.shiprocket.awbRetryCount}: ${order.shiprocket.awb}`);

        return res.json({
          success: true,
          message: "AWB assigned successfully",
          shiprocket: order.shiprocket,
        });
      }

      // No AWB in response - classify as error
      awbError = classifyAwbError({ message: "AWB response missing awb_code", details: awbResult });

    } catch (err) {
      // Classify the error
      awbError = classifyAwbError(err);
      console.error(`[Shiprocket] AWB retry #${order.shiprocket.awbRetryCount} failed (${awbError.code}):`, err.message);
    }

    // Update error info and save
    order.shiprocket.awbError = awbError.message;
    order.shiprocket.awbErrorCode = awbError.code;
    await order.save();

    // Return error with classification info
    res.status(400).json({
      success: false,
      error: awbError.message,
      errorCode: awbError.code,
      isRetryable: awbError.isRetryable,
      retryCount: order.shiprocket.awbRetryCount,
      shiprocket: order.shiprocket,
    });

  } catch (error) {
    console.error("[Shiprocket] assignAwbToOrder unexpected error:", error);
    res.status(500).json({
      success: false,
      error: "Unexpected error during AWB assignment",
      details: error.message,
    });
  }
};

/**
 * POST /api/shiprocket/generate-label/:id
 * Generate shipping label for an order
 */
exports.generateLabelForOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    if (!order.shiprocket?.shipmentId) {
      return res.status(400).json({
        success: false,
        error: "No shipment exists for this order",
      });
    }

    if (!order.shiprocket.awb) {
      return res.status(400).json({
        success: false,
        error: "AWB not assigned. Assign AWB before generating label.",
      });
    }

    if (order.shiprocket.labelUrl) {
      return res.json({
        success: true,
        message: "Label already generated",
        labelUrl: order.shiprocket.labelUrl,
        alreadyExists: true,
      });
    }

    const labelResult = await generateLabel(order.shiprocket.shipmentId);

    if (labelResult.label_url) {
      order.shiprocket.labelUrl = labelResult.label_url;
      await order.save();

      return res.json({
        success: true,
        message: "Label generated successfully",
        labelUrl: order.shiprocket.labelUrl,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to generate label",
      details: labelResult,
    });
  } catch (error) {
    console.error("[Shiprocket] generateLabelForOrder error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      isTemporary: error.isTemporary || false,
    });
  }
};

/**
 * GET /api/shiprocket/track/:orderId
 * Track shipment by order ID
 */
exports.trackOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Try to find by MongoDB _id or by orderId number
    let order;
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(orderId);
    }
    if (!order) {
      order = await Order.findOne({ orderId: Number(orderId) });
    }

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    if (!order.shiprocket?.awb && !order.shiprocket?.shipmentId) {
      return res.status(400).json({
        success: false,
        error: "No shipment found for this order",
      });
    }

    let trackingData;

    // Try tracking by AWB first, then by shipment ID
    if (order.shiprocket.awb) {
      try {
        trackingData = await trackByAwb(order.shiprocket.awb);
      } catch (err) {
        console.error("[Shiprocket] AWB tracking failed:", err.message);
      }
    }

    if (!trackingData && order.shiprocket.shipmentId) {
      try {
        trackingData = await trackByShipmentId(order.shiprocket.shipmentId);
      } catch (err) {
        console.error("[Shiprocket] Shipment tracking failed:", err.message);
      }
    }

    if (!trackingData) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch tracking information",
      });
    }

    // Extract current status from tracking data
    const currentStatus = trackingData.tracking_data?.shipment_track?.[0]?.current_status ||
                          trackingData.tracking_data?.track_status ||
                          trackingData.current_status;

    // Update order status if changed
    if (currentStatus) {
      const mappedStatus = mapShipmentStatus(currentStatus);
      if (mappedStatus && order.status !== mappedStatus) {
        order.status = mappedStatus;
        order.shiprocket.shipmentStatus = currentStatus;
        await order.save();
      }
    }

    res.json({
      success: true,
      orderId: order.orderId,
      awb: order.shiprocket.awb,
      courierName: order.shiprocket.courierName,
      currentStatus: currentStatus,
      orderStatus: order.status,
      trackingUrl: order.shiprocket.trackingUrl,
      trackingData: trackingData.tracking_data || trackingData,
    });
  } catch (error) {
    console.error("[Shiprocket] trackOrderById error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      isTemporary: error.isTemporary || false,
    });
  }
};

/**
 * GET /api/shiprocket/track/awb/:awb
 * Track shipment by AWB number directly
 */
exports.trackByAwbNumber = async (req, res) => {
  try {
    const awb = req.params.awb;

    if (!awb) {
      return res.status(400).json({ success: false, error: "AWB is required" });
    }

    const trackingData = await trackByAwb(awb);

    res.json({
      success: true,
      awb: awb,
      trackingData: trackingData.tracking_data || trackingData,
    });
  } catch (error) {
    console.error("[Shiprocket] trackByAwbNumber error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      isTemporary: error.isTemporary || false,
    });
  }
};

/**
 * GET /api/shiprocket/status/:id
 * Get shipment status for an order
 */
exports.getShipmentStatus = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId).select("orderId shiprocket status");

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.json({
      success: true,
      orderId: order.orderId,
      orderStatus: order.status,
      shiprocket: order.shiprocket || null,
      hasShipment: !!order.shiprocket?.shipmentId,
      hasAwb: !!order.shiprocket?.awb,
      hasLabel: !!order.shiprocket?.labelUrl,
    });
  } catch (error) {
    console.error("[Shiprocket] getShipmentStatus error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
