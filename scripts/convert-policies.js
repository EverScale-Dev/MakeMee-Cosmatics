const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "..");
const OUTPUT_DIR = path.join(__dirname, "../client/public/policies");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Document mappings: source file -> output name
const documents = [
  { src: "Terms and conditions.docx", out: "terms-and-conditions.html" },
  { src: "Privacy Policy.docx", out: "privacy.html" },
  { src: "Shipping Policy.docx", out: "shipping.html" },
  { src: "Frequently Asked Questions.docx", out: "faq.html" },
];

// Refund policy is PDF - we'll create HTML manually from extracted text
const refundPolicyHTML = `<h1>Refund &amp; Return Policy</h1>
<p>At Makemee, we strive to deliver high-quality skincare products. Due to the nature of personal care items, we follow a strict refund and return policy to ensure safety and hygiene.</p>

<h2>1. No Returns on Opened or Used Products</h2>
<p>For hygiene and safety reasons, <strong>we do not accept returns or offer refunds on opened, used, or tampered products</strong>.</p>

<h2>2. Damaged or Defective Products</h2>
<p>If you receive a product that is <strong>damaged, leaked, or defective</strong>, please notify us within <strong>48 hours of delivery</strong> by emailing <a href="mailto:makemeecosmetics@gmail.com">makemeecosmetics@gmail.com</a> along with:</p>
<ul>
<li>Order ID</li>
<li>Clear images/videos of the product and packaging</li>
</ul>
<p>Once verified, we will arrange a <strong>replacement or refund</strong>, as applicable.</p>

<h2>3. Wrong Product Delivered</h2>
<p>If an incorrect product is delivered, please contact us within <strong>48 hours of receipt</strong>. The product must be <strong>unused, unopened, and in original packaging</strong>.</p>

<h2>4. Refund Process</h2>
<ul>
<li>Approved refunds will be processed to the <strong>original mode of payment</strong>.</li>
<li>Refunds may take <strong>7–10 business days</strong> to reflect, depending on your bank/payment provider.</li>
</ul>

<h2>5. Cancellations</h2>
<p>Orders can be cancelled <strong>only before dispatch</strong>. Once shipped, the order cannot be cancelled or refunded.</p>

<h2>6. Allergic Reactions</h2>
<p>Individual skin responses may vary. We recommend a <strong>patch test</strong> before use. Refunds will <strong>not be provided for allergic reactions or personal preferences</strong>.</p>

<h2>7. Contact Us</h2>
<p>For any queries related to refunds or returns, please contact us at:</p>
<p><strong>Email:</strong> <a href="mailto:makemeecosmetics@gmail.com">makemeecosmetics@gmail.com</a><br>
<strong>Phone:</strong> 9075141925</p>`;

async function convertDocx(srcFile, outFile) {
  const srcPath = path.join(DOCS_DIR, srcFile);
  const outPath = path.join(OUTPUT_DIR, outFile);

  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Source file not found: ${srcFile}`);
    return;
  }

  try {
    const result = await mammoth.convertToHtml({ path: srcPath });
    fs.writeFileSync(outPath, result.value, "utf8");
    console.log(`✅ Converted: ${srcFile} → ${outFile}`);

    if (result.messages.length > 0) {
      console.log(`   Warnings:`, result.messages);
    }
  } catch (err) {
    console.error(`❌ Error converting ${srcFile}:`, err.message);
  }
}

async function main() {
  console.log("Converting policy documents to HTML...\n");

  // Convert all .docx files
  for (const doc of documents) {
    await convertDocx(doc.src, doc.out);
  }

  // Write refund policy (from PDF content)
  const refundPath = path.join(OUTPUT_DIR, "refund.html");
  fs.writeFileSync(refundPath, refundPolicyHTML, "utf8");
  console.log(`✅ Created: refund.html (from PDF content)`);

  console.log("\n✅ All policies converted to:", OUTPUT_DIR);
}

main();
