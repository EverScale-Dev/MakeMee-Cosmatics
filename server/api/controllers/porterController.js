const axios = require('axios');
const sendEmail = require("../../utils/sendMail");
const Order = require("../../models/Order");
const mongoose = require('mongoose');


// Create Order Function
const createOrder = async (req, res) => {
  const { request_id, drop_details, email_id } = req.body;
  console.log("porter Response", req.body)

  // Static details for the pickup address and delivery instructions
  const pickupDetails = {
    address: {
      apartment_address: "Shop No, 55 56",
      street_address1: "Chatrapati Shivaji Market, Camp",
      street_address2: "", 
      landmark: "Near St. Xaviers Church",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      country: "India",
      lat: 18.517805010694502,
      lng: 73.88485517312623,
      contact_details: {
        name: "Test Sender",
        phone_number: "+919876543210"
      }
    }
  };


  try {

    const response = await axios.post(`${process.env.PORTER_BASE_URL}/create`,
      {
        request_id, 
        pickup_details: pickupDetails, 
        drop_details, 
      },
      {
        headers: {
          'x-api-key': process.env.PORTER_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

     // Check if response has the required fields
     if (!response.data || !response.data.order_id || !response.data.tracking_url) {
      throw new Error('Porter API response missing necessary data');
    }

    const porterOrderId = response.data.order_id;
    const trackingUrl = response.data.tracking_url;

        const existingOrder = await Order.findOne({ _id : request_id});


        if (!existingOrder) {
          return res.status(404).json({ message: "Order not found or ID does not match." });
        }
    
        // Save Porter order ID in the existing order
        existingOrder.porterOrderId = porterOrderId;
        await existingOrder.save();

      await sendEmail({
        email: email_id,
        subject: "Your Order Tracking URL",
        message: `Thank you for your order! Your Order ID is: ${porterOrderId}. You can track your order here: ${trackingUrl}`,
      });
    
    // Return the response from the Porter API
    res.status(200).json(response.data);
    // console.log("porter Response", response)
  } catch (error) {
    // console.error('Error creating Porter order:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to create Porter order', error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  const { crn } = req.params; 
 // Find the order using the crn (orderId) and check if porterOrderId exists
 const existingOrder = await Order.findOne({ _id: crn }).populate('customer');

 if (!existingOrder) {
   return res.status(404).json({ message: "Order not found" });
 }

 if (!existingOrder.porterOrderId) {
   return res.status(400).json({ message: "No Porter order ID found for this order" });
 }

 // Get the Porter order ID from the order data
 const porterOrderId = existingOrder.porterOrderId;
//  console.log(`Canceling Porter Order ID: ${porterOrderId}`);

  try {
    const response = await axios.post(`${process.env.PORTER_BASE_URL}/${porterOrderId}/cancel`,{},
      {
        headers: {
          'x-api-key': process.env.PORTER_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    // Send confirmation email to the customer (populated from the 'customer' field)
    const emailMessage = `Your order with ID ${crn} has been successfully canceled.`;
    await sendEmail({
      email: existingOrder.customer.email, // Use the populated customer email
      subject: "Order Cancellation Confirmation",
      message: emailMessage,
    });


    res.status(200).json({ message: 'Order canceled successfully', data: response.data});
    console.log("Order canceled successfully:", response.data);
  } catch (error) {
    console.error('Error canceling Porter order:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to cancel Porter order' ,data: error.response?.data || error.message});
  }
};

module.exports = {
  createOrder,
  cancelOrder, 
};
