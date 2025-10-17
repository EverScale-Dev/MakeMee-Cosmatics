const axios = require('axios');
require('dotenv').config();

const BASE = process.env.SHIPROCKET_BASE;

let token = null;
let expiry = 0;

async function login() {
  const res = await axios.post(`${BASE}/auth/login`, {
    email: process.env.SHIPROCKET_API_EMAIL,
    password: process.env.SHIPROCKET_API_PASSWORD
  });
  token = res.data.token;
  expiry = Date.now() + 9 * 24 * 60 * 60 * 1000;
}

async function getHeaders() {
  if (!token || Date.now() > expiry) await login();
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function createOrder(orderData) {
  const headers = await getHeaders();
  const res = await axios.post(`${BASE}/orders/create/adhoc`, orderData, { headers });
  return res.data;
}

async function assignAwb(shipmentIds) {
  const headers = await getHeaders();
  const res = await axios.post(`${BASE}/courier/assign/awb`, { shipment_id: shipmentIds }, { headers });
  return res.data;
}

async function generateLabel(shipmentIds) {
  const headers = await getHeaders();
  const res = await axios.post(`${BASE}/courier/generate/label`, { shipment_id: shipmentIds }, { headers });
  return res.data;
}

async function trackByAwb(awb) {
  const headers = await getHeaders();
  const res = await axios.get(`${BASE}/courier/track/awb/${awb}`, { headers });
  return res.data;
}

module.exports = {
  createOrder,
  assignAwb,
  generateLabel,
  trackByAwb
};
