const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.SHIPROCKET_BASE || "https://apiv2.shiprocket.in/v1/external";

// Token management
let token = null;
let tokenExpiry = 0;

// Custom error class for Shiprocket errors
class ShiprocketError extends Error {
  constructor(message, code, isTemporary = false, details = null) {
    super(message);
    this.name = "ShiprocketError";
    this.code = code;
    this.isTemporary = isTemporary;
    this.details = details;
  }
}

// Validate configuration
function validateConfig() {
  if (!process.env.SHIPROCKET_API_EMAIL || !process.env.SHIPROCKET_API_PASSWORD) {
    throw new ShiprocketError(
      "Shiprocket credentials not configured",
      "CONFIG_ERROR",
      false
    );
  }
}

// Login and get token
async function login() {
  validateConfig();

  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: process.env.SHIPROCKET_API_EMAIL,
      password: process.env.SHIPROCKET_API_PASSWORD,
    });

    if (!res.data?.token) {
      throw new ShiprocketError("No token received from Shiprocket", "AUTH_ERROR", false);
    }

    token = res.data.token;
    // Set expiry to 9 days (Shiprocket tokens expire in 10 days)
    tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;

    console.log("[Shiprocket] Successfully authenticated");
    return token;
  } catch (error) {
    if (error instanceof ShiprocketError) throw error;

    const message = error.response?.data?.message || error.message;
    throw new ShiprocketError(
      `Shiprocket authentication failed: ${message}`,
      "AUTH_ERROR",
      true
    );
  }
}

// Get auth headers (with auto-refresh)
async function getHeaders() {
  if (!token || Date.now() > tokenExpiry) {
    await login();
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// Generic API request wrapper with error handling
async function apiRequest(method, endpoint, data = null, retries = 2) {
  const headers = await getHeaders();
  const url = `${BASE_URL}${endpoint}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const config = { method, url, headers };
      if (data) config.data = data;

      const res = await axios(config);
      return res.data;
    } catch (error) {
      const statusCode = error.response?.status;
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || errorData?.error || error.message;

      // Token expired - refresh and retry
      if (statusCode === 401 && attempt < retries) {
        console.log("[Shiprocket] Token expired, refreshing...");
        token = null;
        continue;
      }

      // Rate limited - temporary error
      if (statusCode === 429) {
        throw new ShiprocketError(
          "Shiprocket rate limit exceeded",
          "RATE_LIMIT",
          true,
          errorData
        );
      }

      // Server error - temporary
      if (statusCode >= 500) {
        throw new ShiprocketError(
          `Shiprocket server error: ${errorMessage}`,
          "SERVER_ERROR",
          true,
          errorData
        );
      }

      // Client error - permanent
      if (statusCode >= 400) {
        throw new ShiprocketError(
          `Shiprocket API error: ${errorMessage}`,
          "API_ERROR",
          false,
          errorData
        );
      }

      // Network error - temporary
      throw new ShiprocketError(
        `Network error: ${error.message}`,
        "NETWORK_ERROR",
        true
      );
    }
  }
}

// Create order in Shiprocket
async function createOrder(orderData) {
  console.log("[Shiprocket] Creating order:", orderData.order_id);
  return apiRequest("POST", "/orders/create/adhoc", orderData);
}

// Assign AWB to shipment
async function assignAwb(shipmentId) {
  console.log("[Shiprocket] Assigning AWB for shipment:", shipmentId);
  return apiRequest("POST", "/courier/assign/awb", { shipment_id: shipmentId });
}

// Generate shipping label
async function generateLabel(shipmentId) {
  console.log("[Shiprocket] Generating label for shipment:", shipmentId);
  return apiRequest("POST", "/courier/generate/label", { shipment_id: [shipmentId] });
}

// Track shipment by AWB
async function trackByAwb(awb) {
  console.log("[Shiprocket] Tracking AWB:", awb);
  return apiRequest("GET", `/courier/track/awb/${awb}`);
}

// Track shipment by shipment ID
async function trackByShipmentId(shipmentId) {
  console.log("[Shiprocket] Tracking shipment ID:", shipmentId);
  return apiRequest("GET", `/courier/track/shipment/${shipmentId}`);
}

// Get pickup locations
async function getPickupLocations() {
  console.log("[Shiprocket] Fetching pickup locations");
  const result = await apiRequest("GET", "/settings/company/pickup");
  return result.data?.shipping_address || [];
}

// Check courier serviceability
async function checkServiceability(pickupPincode, deliveryPincode, weight, cod = false) {
  console.log("[Shiprocket] Checking serviceability:", { pickupPincode, deliveryPincode, weight });
  return apiRequest("GET", `/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=${cod ? 1 : 0}`);
}

// Get order details from Shiprocket
async function getOrder(shiprocketOrderId) {
  console.log("[Shiprocket] Getting order:", shiprocketOrderId);
  return apiRequest("GET", `/orders/show/${shiprocketOrderId}`);
}

// Cancel shipment
async function cancelShipment(awbs) {
  console.log("[Shiprocket] Cancelling shipment:", awbs);
  return apiRequest("POST", "/orders/cancel/shipment/awbs", { awbs });
}

module.exports = {
  createOrder,
  assignAwb,
  generateLabel,
  trackByAwb,
  trackByShipmentId,
  getPickupLocations,
  checkServiceability,
  getOrder,
  cancelShipment,
  getHeaders,
  ShiprocketError,
  BASE_URL,
};
