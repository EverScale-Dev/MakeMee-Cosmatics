const PDFDocument = require("pdfkit");
const path = require("path");

const COLORS = {
  primary: "#1F2D5A",
  accent: "#731162",
  text: "#222222",
  muted: "#666666",
  background: "#F8FAFC",
  border: "#E5E7EB",
  highlight: "#1E88E5",
};

// === HEADER ===
function generateHeader(doc, order, logoPath) {
  doc.image(logoPath, 60, 45, { width: 70 });

  doc.fontSize(18).fillColor(COLORS.primary).text("MakeMee Cosmetics", 150, 50);
  doc.fontSize(10).fillColor(COLORS.muted)
    .text("Derde Korhale, Kopargaon Ahilyanagar, Maharashtra 423601", 150, 70)
    .text("support@makemee.com | +91 9876543210", 150, 83);

  const infoX = 400;
  doc.fontSize(11).fillColor(COLORS.primary).text("INVOICE", infoX, 50, { align: "right" });
  doc.fontSize(10).fillColor(COLORS.text)
    .text(`Order ID: ${order.orderId}`, infoX, 65, { align: "right" })
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, infoX, 78, { align: "right" });

  doc.moveTo(60, 110).lineTo(550, 110).strokeColor(COLORS.accent).lineWidth(1).stroke();
}

// === CUSTOMER SECTION ===
function generateCustomerSection(doc, order) {
  doc.moveDown(2);
  const sectionTop = doc.y;
  doc.rect(60, sectionTop, 480, 90).fillAndStroke(COLORS.background, COLORS.border);

  const y = sectionTop + 10;
  const customer = order.customer;

  doc.fillColor(COLORS.primary).fontSize(12).text("Shipping Information", 70, y);

  doc.fillColor(COLORS.text).fontSize(10)
    .text(customer.fullName, 70, y + 18)
    .text(customer.email, 70, y + 31)
    .text(customer.phone, 70, y + 44);

  const addr = customer.shippingAddress;
  doc.text(`${addr.apartment_address}, ${addr.street_address1}`, 70, y + 57)
    .text(`${addr.city}, ${addr.state} - ${addr.pincode}`, 70, y + 70);

  doc.moveDown(4);
}

// === ORDER TABLE ===
function generateTable(doc, order) {
  const startX = 60;
  let y = doc.y;

  const tableWidth = 480;
  const colWidths = [210, 80, 90, 100];
  const headers = ["Product", "Quantity", "Price", "Total"];
  const rowHeight = 25;

  // Table Header
  doc.rect(startX, y, tableWidth, rowHeight).fill(COLORS.accent);
  headers.forEach((header, i) => {
    doc.fillColor("#FFFFFF").fontSize(10)
      .text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y + 7, { width: colWidths[i], align: "center" });
  });
  y += rowHeight;

  // Table Rows
  order.products.forEach((item, idx) => {
    const { name, quantity, price, product } = item;
    const weights = product.weights ? product.weights.map(w => w.weight).join(", ") : "";
    const bgColor = idx % 2 === 0 ? "#FFFFFF" : COLORS.background;

    // Row background
    doc.rect(startX, y, tableWidth, rowHeight).fill(bgColor);

    // Product + weights
    doc.fillColor(COLORS.text).fontSize(10).text(name, startX + 5, y + 7, { width: colWidths[0] - 10 });
    if (weights) doc.fontSize(8).fillColor(COLORS.muted).text(weights, startX + 5, y + 16, { width: colWidths[0] - 10 });

    // Quantity
    doc.fillColor(COLORS.text).fontSize(10).text(quantity, startX + colWidths[0], y + 7, { width: colWidths[1], align: "center" });

    // Price
    doc.text(`₹ ${price.toFixed(2)}`, startX + colWidths[0] + colWidths[1], y + 7, { width: colWidths[2], align: "right" });

    // Total
    doc.text(`₹ ${(price * quantity).toFixed(2)}`, startX + colWidths[0] + colWidths[1] + colWidths[2], y + 7, { width: colWidths[3], align: "right" });

    y += rowHeight;
  });

  // Table Borders
  for (let i = 0; i <= order.products.length + 1; i++) {
    doc.moveTo(startX, doc.y - rowHeight * (order.products.length + 1) + i * rowHeight)
       .lineTo(startX + tableWidth, doc.y - rowHeight * (order.products.length + 1) + i * rowHeight)
       .strokeColor(COLORS.border)
       .lineWidth(0.5).stroke();
  }

  // Column lines
  let x = startX;
  colWidths.forEach(w => {
    x += w;
    doc.moveTo(x, y - rowHeight * (order.products.length + 1)).lineTo(x, y).strokeColor(COLORS.border).lineWidth(0.5).stroke();
  });

  return y + 10;
}

// === TOTALS SECTION ===
function generateTotals(doc, order, y) {
  const startX = 320;
  const boxWidth = 230;
  const boxHeight = 90;

  doc.rect(startX, y, boxWidth, boxHeight).fillAndStroke(COLORS.background, COLORS.border);

  const textX = startX + 15;
  doc.fillColor(COLORS.primary).fontSize(11)
    .text("Subtotal:", textX, y + 12)
    .text("Delivery Charges:", textX, y + 32);

  doc.fillColor(COLORS.text).fontSize(10)
    .text(`₹ ${order.subtotal.toFixed(2)}`, startX + 180, y + 12, { align: "right" })
    .text(`₹ ${(order.deliveryCharge || 0).toFixed(2)}`, startX + 180, y + 32, { align: "right" });

  doc.fillColor(COLORS.primary).fontSize(12).text("Grand Total:", textX, y + 55);
  doc.fillColor(COLORS.highlight).fontSize(14).text(`₹ ${order.totalAmount.toFixed(2)}`, startX + 180, y + 53, { align: "right" });
}

// === THANK YOU ===
function generateThankYouMessage(doc) {
  doc.moveDown(3);
  doc.fillColor(COLORS.primary).fontSize(10)
    .text(
      "Thank you for shopping with MakeMee.\nYour order has been successfully confirmed and is now being prepared with care!\nWe’ll notify you as soon as it’s shipped.\n\nGet ready to enhance your glow, your MakeMee products are on their way!",
      60,
      doc.y,
      { width: 480, align: "left" }
    );
}

// === FOOTER ===
function generateFooter(doc) {
  doc.moveDown(3);
  doc.strokeColor(COLORS.accent).lineWidth(0.5).moveTo(60, doc.y).lineTo(550, doc.y).stroke();

  doc.moveDown(0.8).fillColor(COLORS.primary).fontSize(10)
    .text("Thank you for choosing MakeMee Cosmetics!", { align: "center" })
    .fillColor(COLORS.muted).fontSize(9)
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
