import React, { useState } from "react";
import { Modal, Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const ShippingModal = ({ open, handleClose, order }) => {
  const [loading, setLoading] = useState(false);

  const bookDelivery = async () => {
    const porterOrderData = {
      request_id: order._id,
      email_id: order.customer.email,
      drop_details: {
        address: {
          apartment_address: order.customer.shippingAddress.apartment_address || "",
          street_address1: order.customer.shippingAddress.street_address1 || "",
          city: order.customer.shippingAddress.city || "",
          state: order.customer.shippingAddress.state || "",
          pincode: order.customer.shippingAddress.pincode || "",
          country: "India",
          lat: order.customer.shippingAddress.lat || 0,
          lng: order.customer.shippingAddress.lng || 0,
          contact_details: {
            name: order.customer.fullName,
            phone_number: `+91${order.customer.phone}`,
          },
        },
      },
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/porter/create`,
        porterOrderData
      );
      Swal.fire("Success", "Delivery successfully scheduled!", "success");
      handleClose();
    } catch (error) {
      Swal.fire("Error", "Failed to schedule delivery. Please try again.", "error");
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const cancelDelivery = async () => {
    handleClose(); // Close the modal after success
    // Show a confirmation dialog before canceling
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel the delivery?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });
  
    if (!result.isConfirmed) {
      return; // Exit if the user cancels the confirmation dialog
    }
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/porter/${order._id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` } }
      );
  
      const successMessage = response.data.data.message || "Order canceled successfully!";
      handleClose(); // Close the modal after success
      await Swal.fire("Canceled", successMessage, "success"); // Show success alert
    } catch (error) {
        handleClose(); // Close the modal even on failure
      const errorMessage =
        error.response?.data?.message || "Failed to cancel order.";
      await Swal.fire("Error", errorMessage, "error"); // Show error alert
    }
  }; 



  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Shipping Details
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            <strong>Apartment:</strong> {order?.customer?.shippingAddress?.apartment_address || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>Street:</strong> {order?.customer?.shippingAddress?.street_address1 || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>City:</strong> {order?.customer?.shippingAddress?.city || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>State:</strong> {order?.customer?.shippingAddress?.state || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>Pincode:</strong> {order?.customer?.shippingAddress?.pincode || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>Latitude:</strong> {order?.customer?.shippingAddress?.lat || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>Longitude:</strong> {order?.customer?.shippingAddress?.lng || "N/A"}
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={bookDelivery}
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Delivery"}
            </Button>
            <Button variant="outlined" color="error" onClick={cancelDelivery}>
              Cancel Delivery
            </Button>
          </Box>
        </Box>
      </Modal>
      
    </>
  );
};

export default ShippingModal;
