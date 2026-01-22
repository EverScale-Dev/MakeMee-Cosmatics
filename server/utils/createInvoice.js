const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const COLORS = {
  primary: "#1F2D5A",
  accent: "#731162",
  text: "#222222",
  muted: "#666666",
  background: "#F8FAFC",
  border: "#E5E7EB",
  highlight: "#731162",
  white: "#FFFFFF",
};

// Page dimensions
const PAGE = {
  left: 50,
  right: 545,
  width: 495,
};

// === HEADER ===
function generateHeader(doc, order, logoPath) {
  const startY = 40;

  // Logo (if exists)
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, PAGE.left, startY, { width: 60 });
  }

  // Company name and details
  doc.fontSize(20).fillColor(COLORS.accent).font("Helvetica-Bold")
    .text("MakeMee Cosmetics", PAGE.left + 70, startY);

  doc.fontSize(9).fillColor(COLORS.muted).font("Helvetica")
    .text("Derde Korhale, Kopargaon, Ahilyanagar", PAGE.left + 70, startY + 22)
    .text("Maharashtra 423601, India", PAGE.left + 70, startY + 33)
    .text("support@makemee.in | +91 98765 43210", PAGE.left + 70, startY + 44);

  // Invoice title and order info (right aligned)
  doc.fontSize(24).fillColor(COLORS.accent).font("Helvetica-Bold")
    .text("INVOICE", PAGE.right - 120, startY, { width: 120, align: "right" });

  doc.fontSize(10).fillColor(COLORS.text).font("Helvetica")
    .text(`Order #${order.orderId}`, PAGE.right - 150, startY + 28, { width: 150, align: "right" })
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, PAGE.right - 150, startY + 42, { width: 150, align: "right" });

  // Divider line
  doc.moveTo(PAGE.left, 100).lineTo(PAGE.right, 100).strokeColor(COLORS.accent).lineWidth(2).stroke();

  return 115;
}

// === CUSTOMER SECTION ===
function generateCustomerSection(doc, order, startY) {
  const customer = order.customer;
  const addr = customer.shippingAddress || {};

  // Bill To section
  doc.fontSize(11).fillColor(COLORS.accent).font("Helvetica-Bold")
    .text("BILL TO:", PAGE.left, startY);

  doc.fontSize(10).fillColor(COLORS.text).font("Helvetica-Bold")
    .text(customer.fullName || "Customer", PAGE.left, startY + 16);

  doc.fontSize(9).fillColor(COLORS.muted).font("Helvetica");

  let addressY = startY + 30;
  if (addr.apartment_address) {
    doc.text(addr.apartment_address, PAGE.left, addressY);
    addressY += 12;
  }
  if (addr.street_address1) {
    doc.text(addr.street_address1, PAGE.left, addressY);
    addressY += 12;
  }
  if (addr.city || addr.state || addr.pincode) {
    doc.text(`${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}`, PAGE.left, addressY);
    addressY += 12;
  }

  // Contact info on the right
  doc.fontSize(11).fillColor(COLORS.accent).font("Helvetica-Bold")
    .text("CONTACT:", PAGE.left + 280, startY);

  doc.fontSize(9).fillColor(COLORS.muted).font("Helvetica")
    .text(customer.email || "", PAGE.left + 280, startY + 16)
    .text(customer.phone || "", PAGE.left + 280, startY + 28);

  // Payment method
  doc.fontSize(11).fillColor(COLORS.accent).font("Helvetica-Bold")
    .text("PAYMENT:", PAGE.left + 280, startY + 48);

  doc.fontSize(9).fillColor(COLORS.muted).font("Helvetica")
    .text(order.paymentMethod === "onlinePayment" ? "Online Payment" : "Cash on Delivery", PAGE.left + 280, startY + 62);

  return startY + 90;
}

// === ORDER TABLE ===
function generateTable(doc, order, startY) {
  const tableTop = startY + 10;
  const rowHeight = 28;

  // Column positions (fixed positions for better alignment)
  const cols = {
    product: PAGE.left,
    qty: PAGE.left + 250,
    price: PAGE.left + 320,
    total: PAGE.left + 400,
  };

  // Table Header
  doc.rect(PAGE.left, tableTop, PAGE.width, rowHeight).fill(COLORS.accent);

  doc.fontSize(10).fillColor(COLORS.white).font("Helvetica-Bold");
  doc.text("Product", cols.product + 10, tableTop + 9);
  doc.text("Qty", cols.qty, tableTop + 9, { width: 60, align: "center" });
  doc.text("Price", cols.price, tableTop + 9, { width: 70, align: "right" });
  doc.text("Total", cols.total, tableTop + 9, { width: 85, align: "right" });

  let y = tableTop + rowHeight;

  // Table Rows
  order.products.forEach((item, idx) => {
    const { name, quantity, price } = item;
    const bgColor = idx % 2 === 0 ? COLORS.white : COLORS.background;

    // Row background
    doc.rect(PAGE.left, y, PAGE.width, rowHeight).fill(bgColor);

    // Draw borders
    doc.rect(PAGE.left, y, PAGE.width, rowHeight).stroke(COLORS.border);

    // Product name
    doc.fontSize(9).fillColor(COLORS.text).font("Helvetica")
      .text(name, cols.product + 10, y + 9, { width: 230 });

    // Quantity (centered)
    doc.text(String(quantity), cols.qty, y + 9, { width: 60, align: "center" });

    // Price (right aligned)
    doc.text(`₹${price.toFixed(2)}`, cols.price, y + 9, { width: 70, align: "right" });

    // Total (right aligned)
    doc.text(`₹${(price * quantity).toFixed(2)}`, cols.total, y + 9, { width: 85, align: "right" });

    y += rowHeight;
  });

  // Draw outer table border
  doc.rect(PAGE.left, tableTop, PAGE.width, y - tableTop).stroke(COLORS.border);

  // Draw column separators
  doc.strokeColor(COLORS.border).lineWidth(0.5);
  [cols.qty, cols.price, cols.total].forEach(x => {
    doc.moveTo(x, tableTop).lineTo(x, y).stroke();
  });

  return y + 15;
}

// === TOTALS SECTION ===
function generateTotals(doc, order, y) {
  const boxX = PAGE.left + 280;
  const boxWidth = 215;
  const labelX = boxX + 15;
  const valueX = boxX + boxWidth - 15;

  let currentY = y;

  // Subtotal row
  doc.fontSize(10).fillColor(COLORS.muted).font("Helvetica")
    .text("Subtotal:", labelX, currentY);
  doc.fontSize(10).fillColor(COLORS.text).font("Helvetica")
    .text(`₹${(order.subtotal || 0).toFixed(2)}`, valueX - 80, currentY, { width: 80, align: "right" });
  currentY += 18;

  // Delivery row
  doc.fontSize(10).fillColor(COLORS.muted).font("Helvetica")
    .text("Delivery:", labelX, currentY);
  doc.fontSize(10).fillColor(COLORS.text).font("Helvetica")
    .text(`₹${(order.deliveryCharge || 0).toFixed(2)}`, valueX - 80, currentY, { width: 80, align: "right" });
  currentY += 18;

  // Coupon discount row (if applied)
  if (order.couponCode && order.couponDiscount > 0) {
    doc.fontSize(10).fillColor("#2E7D32").font("Helvetica")
      .text(`Discount (${order.couponCode}):`, labelX, currentY);
    doc.fontSize(10).fillColor("#2E7D32").font("Helvetica")
      .text(`-₹${(order.couponDiscount).toFixed(2)}`, valueX - 80, currentY, { width: 80, align: "right" });
    currentY += 18;
  }

  // Divider line
  doc.moveTo(boxX, currentY + 2).lineTo(boxX + boxWidth, currentY + 2).strokeColor(COLORS.border).lineWidth(1).stroke();

  // Grand Total row (highlighted)
  doc.rect(boxX, currentY + 9, boxWidth, 30).fill(COLORS.accent);
  doc.fontSize(11).fillColor(COLORS.white).font("Helvetica-Bold")
    .text("Grand Total:", labelX, currentY + 18);
  doc.fontSize(14).fillColor(COLORS.white).font("Helvetica-Bold")
    .text(`₹${(order.totalAmount || 0).toFixed(2)}`, valueX - 90, currentY + 16, { width: 90, align: "right" });

  return currentY + 54;
}

// === THANK YOU MESSAGE ===
function generateThankYouMessage(doc, y) {
  const messageY = y + 20;

  doc.rect(PAGE.left, messageY, PAGE.width, 70).fill(COLORS.background);

  doc.fontSize(11).fillColor(COLORS.accent).font("Helvetica-Bold")
    .text("Thank you for your order!", PAGE.left + 15, messageY + 12);

  doc.fontSize(9).fillColor(COLORS.muted).font("Helvetica")
    .text(
      "Your order has been confirmed and is being prepared with care. " +
      "We'll notify you when it ships. Get ready to enhance your glow!",
      PAGE.left + 15,
      messageY + 30,
      { width: PAGE.width - 30 }
    );

  return messageY + 85;
}

// === FOOTER ===
function generateFooter(doc) {
  const footerY = 720;

  // Divider line
  doc.moveTo(PAGE.left, footerY).lineTo(PAGE.right, footerY).strokeColor(COLORS.accent).lineWidth(1).stroke();

  // Footer content
  doc.fontSize(9).fillColor(COLORS.accent).font("Helvetica-Bold")
    .text("MakeMee Cosmetics", PAGE.left, footerY + 12);

  doc.fontSize(8).fillColor(COLORS.muted).font("Helvetica")
    .text("Be your own kind of beautiful.", PAGE.left, footerY + 24);

  // Support info on right
  doc.fontSize(8).fillColor(COLORS.muted).font("Helvetica")
    .text("Questions? Contact us:", PAGE.right - 150, footerY + 12, { width: 150, align: "right" })
    .text("support@makemee.in", PAGE.right - 150, footerY + 24, { width: 150, align: "right" });
}

// === MAIN FUNCTION ===
const createInvoice = (order) => {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const buffers = [];
  const logoPath = path.join(__dirname, "../public/logo.png");

  doc.on("data", buffers.push.bind(buffers));

  // Generate all sections with proper Y coordinate flow
  const headerEndY = generateHeader(doc, order, logoPath);
  const customerEndY = generateCustomerSection(doc, order, headerEndY);
  const tableEndY = generateTable(doc, order, customerEndY);
  const totalsEndY = generateTotals(doc, order, tableEndY);
  generateThankYouMessage(doc, totalsEndY);
  generateFooter(doc);

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

module.exports = createInvoice;
