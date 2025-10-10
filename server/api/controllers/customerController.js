const Customer = require("../../models/Customer");

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, shippingAddress } = req.body;

      // Validate required fields in the main body
      if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
        return res.status(400).json({ message: "Full name is required and must be at least 2 characters long." });
      }
  
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "A valid email address is required." });
      }
  
      if (!phone || !/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: "A valid 10-digit phone number is required." });
      }
  
      // Validate shippingAddress fields
      if (!shippingAddress || typeof shippingAddress !== "object") {
        return res.status(400).json({ message: "Shipping address is required and must be an object." });
      }
  
      const requiredFields = ["apartment_address", "street_address1", "city", "state", "lat", "lng", "pincode"];
      for (const field of requiredFields) {
        if (!shippingAddress[field]) {
          return res.status(400).json({ message: `Shipping address is missing field: ${field}` });
        }
      }
  
      if (!/^\d{6}$/.test(shippingAddress.pincode)) {
        return res.status(400).json({ message: "Pincode must be a valid 6-digit number." });
      }
  
      // Validate latitude and longitude
      if (isNaN(shippingAddress.lat) || isNaN(shippingAddress.lng)) {
        return res.status(400).json({ message: "Latitude and Longitude must be valid numbers." });
      }

    // Create a new customer instance
    const newCustomer = new Customer({
      fullName,
      email,
      phone,
      shippingAddress,
    });

    // Save the customer to the database
    await newCustomer.save();

    // Respond with the created customer
    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Error creating customer", error: error.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch customers with pagination
    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total number of customers for pagination info
    const totalCount = await Customer.countDocuments();

    // Send the customers and total count to the frontend
    res.status(200).json({
      customers,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error while fetching customers" });
  }
};

// Get a customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(400).json({ message: "Error fetching customer", error: error.message });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(400).json({ message: "Error updating customer", error: error.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(400).json({ message: "Error deleting customer", error: error.message });
  }
};
