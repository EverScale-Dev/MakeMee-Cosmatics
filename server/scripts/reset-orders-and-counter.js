require("dotenv").config({ path: "./server/.env" });
const mongoose = require("mongoose");
const Order = require("../models/Order");
const connectDB = require("../config/db");

/**
 * This script resets the entire order system.
 *
 * IT PERFORMS THE FOLLOWING DESTRUCTIVE ACTIONS:
 * 1. Deletes ALL orders from the database.
 * 2. Resets the auto-incrementing orderId counter to 0.
 *
 * The next order created after running this script will have an orderId of 1.
 *
 * USAGE:
 * node server/scripts/reset-orders-and-counter.js
 */
const resetOrdersAndCounter = async () => {
  try {
    // 1. Connect to the database
    await connectDB();
    console.log("MongoDB Connected...");

    // 2. Delete all orders
    console.log("Deleting all orders...");
    const { deletedCount } = await Order.deleteMany({});
    console.log(`✅ ${deletedCount} orders deleted.`);

    // 3. Reset the 'orderId' counter
    // This targets the counter document used by mongoose-sequence for the Order model.
    console.log("Resetting 'orderId' counter...");
    const updateResult = await mongoose.connection.db
      .collection("counters")
      .updateOne(
        { id: "orderId" },
        { $set: { seq: 0 } },
        { upsert: true } // Use upsert to create the counter if it doesn't exist
      );

    if (updateResult.modifiedCount > 0) {
      console.log("✅ Counter for 'orderId' was reset to 0.");
    } else if (updateResult.upsertedCount > 0) {
      console.log("✅ Counter for 'orderId' was not found, so a new one was created and set to 0.");
    } else {
      console.log("✅ Counter for 'orderId' was already 0.");
    }

    console.log("\n🔥 Order reset process completed successfully. The next order will be #1.");

  } catch (err) {
    console.error("\n❌ An error occurred during the reset process:");
    console.error(err);
  } finally {
    // 4. Close the connection
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed.");
  }
};

// --- Confirmation Step ---
// To prevent accidental execution, this script will wait for user confirmation.
// We can't use process.stdin here, so for now it runs directly.
// In a real-world scenario, you might add a command-line flag requirement.
console.log("⚠️  WARNING: This is a destructive operation.");
console.log("This script will delete all orders and reset the order counter.");

// Adding a small delay to allow user to read the warning.
setTimeout(() => {
  resetOrdersAndCounter();
}, 3000);
