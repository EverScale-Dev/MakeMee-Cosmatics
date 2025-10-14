const PDFDocument = require("pdfkit");
const path = require("path");

function generateHeader(doc, order, logoPath, headerColor, secondaryTextColor) {
    const lineSpacing = 10;
    
    // Logo and Company Name (Centered company name next to logo)
    doc.image(logoPath, 50, 50, { width: 80 })
       .fillColor(headerColor)
       .fontSize(20)
       .text("MakeMee Cosmatics", 150, 50, { width: 400, align: "center" })
       .moveDown(0.3)
       .fontSize(10)
       .fillColor(secondaryTextColor)
       .text("Derde Korhale, Kopargaon Ahilyanagar, Maharashtra 423601", {
           width: 400,
           align: "center",
       });

    // Order Title and Details (Centered)
    doc.moveDown(2.5) // Move down from company address
       .fontSize(18)
       .fillColor(headerColor)
       .text("Order Invoice", { align: "center" })
       .moveDown(0.5)
       .fontSize(12)
       .fillColor(order.textColor)
       .text(`Order ID: ${order.orderId}`, { align: "center" })
       .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: "center" })
       .moveDown(1.5);
    
    // Divider Line
    doc.moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .strokeColor("#ddd")
       .lineWidth(1)
       .stroke()
       .moveDown(1.5);
}

/**
 * Draws the Shipping Information block.
 */
function generateShippingInfo(doc, order, headerColor, textColor) {
    doc.fillColor(headerColor)
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
    doc.moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .strokeColor("#ddd")
       .lineWidth(1)
       .stroke()
       .moveDown(1.5);
}

/**
 * Draws the Order Summary table items.
 */
function generateTable(doc, order, headerColor, textColor) {
    // Order Summary Header
    doc.fillColor(headerColor)
       .fontSize(14)
       .text("Order Summary", { underline: true })
       .moveDown(1);

    // Table Setup
    const headers = ["Product", "Quantity", "Price", "Total"];
    const startX = 50;
    let startY = doc.y;
    const columnWidths = [180, 80, 100, 100];
    const rowHeight = 20;

    // Table Headers with Background and Padding
    let currentX = startX;
    headers.forEach((header, i) => {
        const width = columnWidths[i];
        doc.fillColor(headerColor)
           .rect(currentX, startY, width, rowHeight)
           .fill();
        
        doc.fillColor("#fff") // White text for header
           .fontSize(10)
           .text(header, currentX + 5, startY + 5, { width: width - 10, align: "center" });
        currentX += width;
    });

    let y = startY + rowHeight + 5; // Start y for the first item row

    // Table Rows for Each Product
    order.products.forEach((item) => {
        const { name, price, quantity, product } = item;
        const weights = product.weights ? product.weights.map(w => w.weight).join(", ") : "";
        
        doc.fillColor(textColor)
           .fontSize(10);
        
        // Product Name and Weights
        doc.text(name, startX + 10, y, { width: columnWidths[0] - 10 });
        if (weights) {
            doc.text(weights, startX + 10, y + 12, { width: columnWidths[0] - 10 });
        }
        
        // Quantity, Price, Total
        doc.text(quantity, startX + columnWidths[0] + 10, y, { width: columnWidths[1] - 20, align: "right" })
           .text(`Rs. ${price.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1] + 10, y, { width: columnWidths[2] - 20, align: "right" })
           .text(`Rs. ${(price * quantity).toFixed(2)}`, startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + 10, y, { width: columnWidths[3] - 20, align: "right" });
        
        // Increase y position, accounting for name and weights
        y += weights ? rowHeight * 2 : rowHeight * 1.5;
    });

    return y;
}

/**
 * Draws the Totals and Payment block.
 */
function generateTotalsAndPayment(doc, order, y, headerColor, textColor) {
    const startX = 50;
    const rowHeight = 20;

    // Divider after the item table
    doc.moveTo(startX, y)
       .lineTo(startX + 500, y)
       .strokeColor('#cccccc')
       .lineWidth(1)
       .stroke();
    y += rowHeight * 0.75; // Adjust space below the divider

    // Delivery Charges and Total calculation
    const currentY = y;
    const totalAmount = order.totalAmount + (order.deliveryCharges || 0);

    // Delivery Charges
    doc.fillColor(headerColor)
       .fontSize(12)
       .text("Delivery Charges:", startX, currentY)
       .fillColor(textColor)
       .text(`Rs. ${order.deliveryCharges ? order.deliveryCharges.toFixed(2) : "0.00"}`, 450, currentY, { align: "right" })
       .moveDown();

    // Total
    doc.fillColor(headerColor)
       .text("Total:", startX, currentY + rowHeight)
       .fillColor("#000")
       .fontSize(14)
       .text(`Rs. ${totalAmount.toFixed(2)}`, 450, currentY + rowHeight, { align: "right" })
       .moveDown(2);
    
    // Payment Method
    doc.y = currentY + rowHeight * 3.5;
    doc.fillColor(headerColor)
       .fontSize(12)
       .text("Payment Status", startX)
       .fillColor(textColor)
       .text("COD", startX, doc.y + 15)
       .moveDown(3);
}

// --- Main Function ---

const createInvoice = (order) => {
    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];

    // Style constants
    const headerColor = "#4CAF50";
    const textColor = "#333";
    const secondaryTextColor = "#777";
    const logoPath = path.join(__dirname, "../public/logo.png");

    // Capture the PDF output in a buffer
    doc.on("data", buffers.push.bind(buffers));

    // 1. Generate Header and Order Details
    generateHeader(doc, order, logoPath, headerColor, secondaryTextColor);

    // 2. Generate Shipping Information
    generateShippingInfo(doc, order, headerColor, textColor);

    // 3. Generate Order Summary Table
    let tableEndY = generateTable(doc, order, headerColor, textColor);

    // 4. Generate Totals and Payment
    generateTotalsAndPayment(doc, order, tableEndY, headerColor, textColor);

    // Finalize the document
    doc.end();

    // Return the PDF as a buffer promise
    return new Promise((resolve) => {
        doc.on("end", () => resolve(Buffer.concat(buffers)));
    });
};

module.exports = createInvoice;