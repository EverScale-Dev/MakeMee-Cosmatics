const PDFDocument = require("pdfkit");
const path = require("path");

// === STYLES ===
const COLORS = {
  primary: "#1F2D5A",       // Deep navy for titles
  accent: "#007BFF",        // Corporate blue accent
  text: "#222222",          // Main text
  muted: "#666666",         // Secondary info
  background: "#F8FAFC",    // Section background
  border: "#E5E7EB",        // Light divider
  highlight: "#1E88E5",     // Highlight total
};

// === HEADER ===
function generateHeader(doc, order, logoPath) {
  // Logo
  doc.image(logoPath, 60, 45, { width: 70 });

  // Company Info
  doc
    .fontSize(18)
    .fillColor(COLORS.primary)
    .text("MakeMee Cosmetics", 150, 50)
    .fontSize(10)
    .fillColor(COLORS.muted)
    .text("Derde Korhale, Kopargaon Ahilyanagar, Maharashtra 423601", 150, 70)
    .text("support@makemee.com | +91 9876543210", 150, 83);

  // Invoice Metadata (right-aligned)
  const infoX = 400;
  doc
    .fontSize(11)
    .fillColor(COLORS.primary)
    .text("INVOICE", infoX, 50, { align: "right" })
    .moveDown(0.3)
    .fontSize(10)
    .fillColor(COLORS.text)
    .text(`Order ID: ${order.orderId}`, infoX, 65, { align: "right" })
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, infoX, 78, { align: "right" });

  // Divider line
  doc
    .moveTo(60, 110)
    .lineTo(550, 110)
    .strokeColor(COLORS.accent)
    .lineWidth(1)
    .stroke();
}

// === CUSTOMER SECTION ===
function generateCustomerSection(doc, order) {
  doc.moveDown(2);
  const sectionTop = doc.y;

  // Background box
  doc.rect(60, sectionTop, 480, 90).fillAndStroke(COLORS.background, COLORS.border);

  const y = sectionTop + 10;
  const customer = order.customer;

  doc
    .fillColor(COLORS.primary)
    .fontSize(12)
    .text("Shipping Information", 70, y);

  doc
    .fillColor(COLORS.text)
    .fontSize(10)
    .text(customer.fullName, 70, y + 18)
    .text(customer.email, 70, y + 31)
    .text(customer.phone, 70, y + 44);

  const addr = customer.shippingAddress;
  doc
    .fillColor(COLORS.text)
    .text(`${addr.apartment_address}, ${addr.street_address1}`, 70, y + 57)
    .text(`${addr.city}, ${addr.state} - ${addr.pincode}`, 70, y + 70);

  doc.moveDown(4);
}

// === ORDER TABLE ===
function generateTable(doc, order) {
  doc.moveDown(1.5);
  doc
    .fillColor(COLORS.primary)
    .fontSize(13)
    .text("Order Summary", 60, doc.y, { underline: true })
    .moveDown(0.5);

  const tableTop = doc.y;
  const startX = 60;
  const columnWidths = [210, 80, 90, 90];
  const headers = ["Product", "Quantity", "Price", "Total"];

  // Header Row
  doc.rect(startX, tableTop, 480, 25).fill(COLORS.accent);
  let x = startX;
  headers.forEach((header, i) => {
    doc
      .fillColor("#FFFFFF")
      .fontSize(10)
      .text(header, x, tableTop + 7, { width: columnWidths[i], align: "center" });
    x += columnWidths[i];
  });

  // Data Rows
  let y = tableTop + 30;
  order.products.forEach((item, idx) => {
    const { name, price, quantity, product } = item;
    const weights = product.weights ? product.weights.map((w) => w.weight).join(", ") : "";
    const bgColor = idx % 2 === 0 ? "#FFFFFF" : COLORS.background;

    doc.rect(startX, y - 3, 480, 25).fill(bgColor);

    doc.fillColor(COLORS.text).fontSize(10).text(name, startX + 10, y, { width: columnWidths[0] - 10 });
    if (weights) doc.fillColor(COLORS.muted).fontSize(8).text(weights, startX + 10, y + 12);

    doc.fillColor(COLORS.text).fontSize(10);
    doc.text(quantity, startX + columnWidths[0] + 5, y, { width: columnWidths[1], align: "center" });
    doc.text(`₹ ${price.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1], y, {
      width: columnWidths[2],
      align: "right",
    });
    doc.text(`₹ ${(price * quantity).toFixed(2)}`, startX + columnWidths[0] + columnWidths[1] + columnWidths[2], y, {
      width: columnWidths[3],
      align: "right",
    });

    y += 25;
  });

  return y + 10;
}

// === TOTALS SECTION ===
function generateTotals(doc, order, y) {
  const startX = 320;
  const boxWidth = 230;

  doc.rect(startX, y, boxWidth, 90).fillAndStroke(COLORS.background, COLORS.border);

  const totalAmount = order.totalAmount + (order.deliveryCharges || 0);
  const textX = startX + 15;

  doc.fillColor(COLORS.primary).fontSize(11);
  doc.text("Subtotal:", textX, y + 12);
  doc.text("Delivery Charges:", textX, y + 32);

  doc.fillColor(COLORS.text).fontSize(10);
  doc.text(`₹ ${order.totalAmount.toFixed(2)}`, startX + 180, y + 12, { align: "right" });
  doc.text(`₹ ${(order.deliveryCharges || 0).toFixed(2)}`, startX + 180, y + 32, { align: "right" });

  doc.fillColor(COLORS.primary).fontSize(12).text("Grand Total:", textX, y + 55);
  doc.fillColor(COLORS.highlight).fontSize(14).text(`₹ ${totalAmount.toFixed(2)}`, startX + 180, y + 53, { align: "right" });
}

// === THANK YOU MESSAGE ===
function generateThankYouMessage(doc) {
  doc.moveDown(3);
  doc
    .fillColor(COLORS.primary)
    .fontSize(10)
    .text(
      "Thank you for shopping with MakeMee.\nYour order has been successfully confirmed and is now being prepared with care!\nWe’ll notify you as soon as it’s shipped.\n\nGet ready to enhance your glow — your MakeMee products are on their way!",
      60,
      doc.y,
      { width: 480, align: "left" }
    );
}

// === FOOTER ===
function generateFooter(doc) {
  doc.moveDown(3);
  doc.strokeColor(COLORS.accent).lineWidth(0.5).moveTo(60, doc.y).lineTo(550, doc.y).stroke();

  doc
    .moveDown(0.8)
    .fillColor(COLORS.primary)
    .fontSize(10)
    .text("Thank you for choosing MakeMee Cosmetics!", { align: "center" })
    .fillColor(COLORS.muted)
    .fontSize(9)
    .text("Be your own kind of beautiful.", { align: "center" });
}

// === MAIN FUNCTION ===
const createInvoice = (order) => {
  const doc = new PDFDocument({ margin: 50 });
  const buffers = [];
  const logoPath = path.join(__dirname, "../public/logo.png");

  doc.on("data", buffers.push.bind(buffers));

  generateHeader(doc, order, logoPath);
  generateCustomerSection(doc, order);
  const tableEndY = generateTable(doc, order);
  generateTotals(doc, order, tableEndY + 15);
  generateThankYouMessage(doc);
  generateFooter(doc);

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

module.exports = createInvoice;
