"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  DialogContentText,
  Snackbar,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShippingModal from "./ShippingModal";
import OrderDetailModal from "./OrderDetailModal";
import useAuth from "../withauth";

export default function OrdersPage() {
  useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit] = useState(10); // Orders per page
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [openShippingModal, setOpenShippingModal] = useState(false);
  const [token, setToken] = useState(null); // State for token
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error("No token found. Redirecting...");
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`,
        {
          params: { limit, skip: (page - 1) * limit },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(response.data.orders); // Adjusted to match the response structure
      setTotalOrders(response.data.totalOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  const handleViewOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
          },
        }
      );
      // console.log("response",response.data);
      setSelectedOrder(response.data);
      setOpen(true);

      // Update orders list to reflect viewed status if needed
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, isViewed: true } : order
        )
      );
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
    setLoading(false);
  };

  // Function to update order status
  const updateOrderStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOpen(false);
      fetchOrders();
      // console.log('Order status updated:', response.data);
    } catch (error) {
      console.error(
        "Error updating order status:",
        error.response.data.message
      );
      alert("Failed to update order status.");
    }
  };


// Handle opening the shipping modal
const handleOpenShippingModal = async (orderId) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSelectedOrder(response.data); // Store order details in state
    setOpenShippingModal(true); // Open the modal
  } catch (error) {
    console.error("Error fetching order details for shipping:", error);
  } finally {
    setLoading(false);
  }
};

// Close the shipping modal
const handleCloseShippingModal = () => {
  setOpenShippingModal(false);
};

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      {/* Loading Indicator */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Orders Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Order ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Customer</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total Amount</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    sx={{
                      backgroundColor: order.isViewed ? "#e0f7fa" : "#f9f9f9",
                      fontWeight: order.isViewed ? "800" : "600",
                    }}
                  >
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customer?.fullName}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>₹ {order.totalAmount}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewOrder(order._id)}>
                        <VisibilityIcon color="primary" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenShippingModal(order._id)}
                      >
                        <LocalShippingIcon color="secondary" />
                      </IconButton>                     
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(totalOrders / limit)}
              page={page}
              onChange={(event, value) => setPage(value)}
            />
          </Box>

          {/* Order Detail Modal */}
          {selectedOrder && (
           <OrderDetailModal order={selectedOrder} open={open} onClose={() => setOpen(false)} onUpdateStatus={updateOrderStatus} />
          )}

         {/* Shipping Modal */}
         {selectedOrder && (
         <ShippingModal open={openShippingModal} handleClose={handleCloseShippingModal} order={selectedOrder} />
        )}


          {/* Snackbar for Cancel Order Result */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000} // Automatically close after 4 seconds
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="error"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
}
