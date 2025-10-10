const PDFDocument = require("pdfkit");
const path = require("path");

const createInvoice = (order) => {
  const doc = new PDFDocument({ margin: 50 });
  let buffers = [];

  // Capture the PDF output in a buffer
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(buffers);
    return pdfBuffer;
  });

  const logoPath = path.join(__dirname, "../public/logo.png");

  // Style adjustments
  const headerColor = "#4CAF50";
  const textColor = "#333";
  const secondaryTextColor = "#777";
  const lineSpacing = 10;

  // Logo and Company Name
  doc
    .image(logoPath, 50, 50, { width: 80 })
    .moveDown(0.5)
    .fillColor(headerColor)
    .fontSize(20)
    .text("Kwality Chicken Center", 150, 50, { width: 400, align: "center" }) // Add width to avoid overlapping with logo
    .moveDown(0.3)
    .fontSize(10)
    .fillColor(secondaryTextColor)
    .text("Shop No, 55 56, Chatrapati Shivaji Market, Camp, Near St. Xaviers Church, Pune, Maharashtra, 411001", {
      width: 400,
      align: "center",
    })
    .moveDown(2);

  // Order Title
  doc
    .fontSize(18)
    .fillColor(headerColor)
    .text("Order Invoice", { align: "center" })
    .moveDown(0.5)
    .fontSize(12)
    .fillColor(textColor)
    .text(`Order ID: ${order.orderId}`, { align: "center" })
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: "center" })
    .moveDown(1.5);

  // Divider Line
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor("#ddd")
    .stroke()
    .moveDown(1.5);

  // Shipping Information
  doc
    .fillColor(headerColor)
    .fontSize(14)
    .text("Shipping Information", { underline: true })
    .moveDown(0.5)
    .fillColor(textColor)
    .fontSize(12)
    .text(`Full Name: ${order.customer.fullName}`)
    .text(`Email: ${order.customer.email}`)
    .text(`Phone: ${order.customer.phone}`)
    .text(
      `Address: ${order.customer.shippingAddress.apartment_address}, ${order.customer.shippingAddress.street_address1}, ${order.customer.shippingAddress.city}`
    )
    .text(`${order.customer.shippingAddress.state}, ${order.customer.shippingAddress.pincode}`)
    .moveDown(1.5);

  // Divider Line
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor("#ddd")
    .stroke()
    .moveDown(1.5);

  // Order Summary Header
  doc
    .fillColor(headerColor)
    .fontSize(14)
    .text("Order Summary", { underline: true })
    .moveDown(1);

  // Order Summary Table Headers with Background and Padding
  const headers = ["Product", "Quantity", "Price", "Total"];
  const startX = 50;
  const startY = doc.y;
  const columnWidths = [180, 80, 100, 100]; // Adjust column widths for better alignment
  const rowHeight = 20;

  headers.forEach((header, i) => {
    doc
      .fillColor(headerColor)
      .rect(startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), startY, columnWidths[i], rowHeight)
      .fontSize(10)
      .text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 10, startY + 5, { width: columnWidths[i] - 20, align: "center" });
  });

  // Move down to give space after headers
  let y = startY + rowHeight * 1.5;

  // Table Rows for Each Product
  order.products.forEach((item) => {
    const { name, price, quantity, product } = item;
    const weights = product.weight
    ? [
        product.weight.grams && `${product.weight.grams}`,
        product.weight.pieces && `${product.weight.pieces}`,
        product.weight.serves && `${product.weight.serves}`,
      ]
        .filter(Boolean)
        .join(" | ")
    : "";

    doc
      .fillColor(textColor)
      .fontSize(10)
      .text(name, startX + 10, y);
      if (weights) {
        doc.text(weights, startX + 10, y + 12); 
      }
    doc
      .text(quantity, startX + columnWidths[0] + 10, y)
      .text(`Rs. ${price.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1] + 10, y)
      .text(`Rs. ${(price * quantity).toFixed(2)}`, startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + 10, y);
    y += rowHeight * 1.5;
  });
  y += rowHeight * 1.5;

  doc
  .moveTo(startX, y)
  .lineTo(startX + 500, y)  // Adjust the line length as needed
  .strokeColor('#cccccc')
  .lineWidth(1)
  .stroke();

// Add space below the divider to prevent overlap with the next section
y += rowHeight * 1.5;

doc.moveDown(1.5);

  // Delivery Charges and Total
  doc
    .fillColor(headerColor)
    .fontSize(12)
    .text("Delivery Charges:", startX, y)
    .fillColor(textColor)
    .text(`Rs. ${order.deliveryCharges ? order.deliveryCharges.toFixed(2) : "0.00"}`, 450, y, { align: "right" })
    .moveDown()
    .fillColor(headerColor)
    .text("Total:", startX, y + rowHeight)
    .fillColor("#000")
    .fontSize(14)
    .text(`Rs. ${(order.totalAmount + (order.deliveryCharges || 0)).toFixed(2)}`, 450, y + rowHeight, { align: "right" })
    .moveDown(2);

  // Payment Method
  doc
    .fillColor(headerColor)
    .fontSize(12)
    .text("Payment Status", startX, y + rowHeight * 2)
    .fillColor(textColor)
    .text("COD", startX, y + rowHeight * 3)
    .moveDown(3);

  // Finalize the document
  doc.end();

  // Return the PDF as a buffer
  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

module.exports = createInvoice;
