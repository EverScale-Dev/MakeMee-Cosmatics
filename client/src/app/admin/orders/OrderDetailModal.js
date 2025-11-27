import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Swal from "sweetalert2";
import axios from "axios";

export default function OrderDetailModal({
  order,
  open,
  onClose,
  onUpdateStatus,
}) {
  // Initialize safely even if order is null
  const [newStatus, setNewStatus] = useState(order?.status ?? "processing");
  const [loading, setLoading] = useState(false);

  // Update state when order changes
  useEffect(() => {
    if (order?.status) {
      setNewStatus(order.status);
    }
  }, [order]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "processing":
        return "info";
      case "cancelled":
      case "failed":
        return "error";
      case "on hold":
      case "pending payment":
        return "warning";
      case "refunded":
        return "secondary";
      case "shipped":
        return "primary";
      default:
        return "default";
    }
  };

  const handleStatusChange = () => {
    if (order) onUpdateStatus(order._id, newStatus);
  };

  const handleInitiateShipment = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shiprocket/ship/${order._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Shipment Created",
        text: "Order has been successfully transferred to Shiprocket.",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Shiprocket Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Create Shipment",
        text:
          error.response?.data?.error ||
          "An unexpected error occurred while creating the shipment.",
      });
    } finally {
      setLoading(false);
    }
  };

  // If no order, render nothing
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 5,
        }}
      >
        <Typography variant="h6">Order Details: #{order.orderId}</Typography>
        <Chip
          label={order.status.toUpperCase()}
          color={getStatusColor(order.status)}
          size="medium"
          sx={{ fontWeight: "bold" }}
        />
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent dividers>
        <Grid container spacing={4}>
          {/* ================= LEFT: Customer Info ================= */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Customer & Shipping
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {order.customer.fullName}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {order.customer.email}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {order.customer.phone}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Shipping Address:</strong>
                <Box component="span" ml={1} color="text.secondary">
                  {`${order.customer.shippingAddress?.street_address1 || ""}, ${
                    order.customer.shippingAddress?.city || ""
                  }, ${order.customer.shippingAddress?.state || ""} - ${
                    order.customer.shippingAddress?.pincode || ""
                  }`}
                </Box>
              </Typography>
            </Paper>

            {/* Status Update & Shipping Initiation */}
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Order Management
              </Typography>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="status-select-label">Update Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="Update Status"
                  fullWidth
                >
                  <MenuItem value="pending payment">Pending Payment</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="on hold">On Hold</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<EditIcon />}
                onClick={handleStatusChange}
                fullWidth
                sx={{ mb: 1 }}
              >
                Save Status
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <LocalShippingIcon />
                  )
                }
                onClick={handleInitiateShipment}
                disabled={order.shiprocket?.awb_code || loading}
                fullWidth
              >
                {order.shiprocket?.awb_code
                  ? "Shipment Created"
                  : loading
                    ? "Creating Shipment..."
                    : "Create Shiprocket Shipment"}
              </Button>
            </Paper>
          </Grid>

          {/* ================= RIGHT: Shiprocket + Summary ================= */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={1}
              sx={{ p: 3, mb: 4, backgroundColor: "#f5f5f5" }}
            >
              <Typography variant="h5" gutterBottom>
                Shipment Details (Shiprocket)
              </Typography>
              <Typography variant="body1">
                <strong>Shiprocket ID:</strong>{" "}
                {order.shiprocket?.shiprocket_order_id || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>AWB / Tracking:</strong>{" "}
                {order.shiprocket?.awb_code || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Courier:</strong>{" "}
                {order.shiprocket?.courier_name || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  href={order.shiprocket?.tracking_url}
                  target="_blank"
                  disabled={!order.shiprocket?.tracking_url}
                  sx={{ mt: 1 }}
                >
                  View Live Tracking
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  href={order.shiprocket?.label_url}
                  target="_blank"
                  disabled={!order.shiprocket?.label_url}
                  sx={{ mt: 1, ml: 1 }}
                >
                  Print Label
                </Button>
              </Typography>
            </Paper>

            {/* Order Summary */}
            <Box>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Order Note:</strong> {order.note || "None"}
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">
                  ₹ {order.subTotal?.toFixed(2) || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1">
                  ₹ {order.shippingFee?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total Payable:</Typography>
                <Typography variant="h6" color="primary.main">
                  ₹ {order.totalAmount?.toFixed(2) || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* ================= BOTTOM: Order Items ================= */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Order Items ({order.products.length})
          </Typography>
          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableHead
                sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}
              >
                <TableRow>
                  <TableCell>
                    <strong>Product</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Price (per unit)</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Qty</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Total</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.products.map((item) => (
                  <TableRow key={item.product?._id || item.name} hover>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">
                      ₹ {item.price?.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ₹ {(item.price * item.quantity)?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
