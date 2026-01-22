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
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RefreshIcon from "@mui/icons-material/Refresh";
import PaymentIcon from "@mui/icons-material/Payment";
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
        title: res.data.alreadyExists ? "Shipment Exists" : "Shipment Created",
        text: res.data.message || "Order has been successfully transferred to Shiprocket.",
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

  const handleRetryAwb = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shiprocket/assign-awb/${order._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: res.data.alreadyExists ? "AWB Already Assigned" : "AWB Assigned",
        text: res.data.message || "AWB has been successfully assigned.",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("AWB Assignment Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Assign AWB",
        text:
          error.response?.data?.error ||
          "An unexpected error occurred while assigning AWB.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to get shipment status display
  const getShipmentStatusInfo = () => {
    if (!order.shiprocket?.shipmentId) {
      return { label: "Not Created", color: "default", canCreate: true };
    }

    // Use internal status field if available
    const internalStatus = order.shiprocket?.status;

    if (internalStatus === "pending_awb" || !order.shiprocket?.awb) {
      return {
        label: "AWB Pending",
        color: "warning",
        canRetryAwb: true,
        errorMessage: order.shiprocket?.awbError,
        errorCode: order.shiprocket?.awbErrorCode,
        retryCount: order.shiprocket?.awbRetryCount || 0,
      };
    }

    if (internalStatus === "ready" || order.shiprocket?.awb) {
      // Check shipment status from Shiprocket
      const shipmentStatus = order.shiprocket?.shipmentStatus?.toUpperCase();
      if (shipmentStatus?.includes("DELIVERED")) {
        return { label: "Delivered", color: "success" };
      }
      if (shipmentStatus?.includes("TRANSIT") || shipmentStatus?.includes("OUT FOR")) {
        return { label: shipmentStatus, color: "info" };
      }
      if (shipmentStatus?.includes("PICKED") || shipmentStatus?.includes("SHIPPED")) {
        return { label: "Shipped", color: "primary" };
      }
      return { label: "Ready to Ship", color: "success" };
    }

    if (internalStatus === "shipped") {
      return { label: "Shipped", color: "primary" };
    }

    if (internalStatus === "delivered") {
      return { label: "Delivered", color: "success" };
    }

    if (internalStatus === "cancelled") {
      return { label: "Cancelled", color: "error" };
    }

    return { label: order.shiprocket?.shipmentStatus || "Unknown", color: "default" };
  };

  // Helper to check if order can have shipment created
  const canCreateShipment = () => {
    // Don't allow if shipment already exists
    if (order.shiprocket?.shipmentId) return false;
    // Don't allow if order is cancelled, refunded, or failed
    if (["cancelled", "refunded", "failed"].includes(order.status)) return false;
    // For online payment, check if status indicates payment complete
    if (order.paymentMethod === "onlinePayment" && order.status === "pending payment") return false;
    return true;
  };

  const shipmentStatus = getShipmentStatusInfo();

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
        <Grid container spacing={3}>
          {/* ================= LEFT COLUMN ================= */}
          <Grid item xs={12} md={6}>
            {/* Customer & Shipping */}
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Customer & Shipping
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="body2">
                  <strong>Name:</strong> {order.customer?.fullName || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {order.customer?.email || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {order.customer?.phone || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Address:</strong>{" "}
                  {order.customer?.shippingAddress?.apartment_address &&
                    `${order.customer.shippingAddress.apartment_address}, `}
                  {order.customer?.shippingAddress?.street_address1 || ""},{" "}
                  {order.customer?.shippingAddress?.city || ""},{" "}
                  {order.customer?.shippingAddress?.state || ""} -{" "}
                  {order.customer?.shippingAddress?.pincode || ""}
                </Typography>
              </Box>
            </Paper>

            {/* Payment Details */}
            <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: order.paymentMethod === "cashOnDelivery" ? "#fff8e1" : "#e8f5e9" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <PaymentIcon color={order.paymentMethod === "cashOnDelivery" ? "warning" : "success"} />
                <Typography variant="h6" fontWeight={600}>
                  Payment Details
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2"><strong>Method:</strong></Typography>
                  <Chip
                    label={order.paymentMethod === "cashOnDelivery" ? "Cash on Delivery" : "Online Payment"}
                    color={order.paymentMethod === "cashOnDelivery" ? "warning" : "success"}
                    size="small"
                  />
                </Box>
                <Typography variant="body2">
                  <strong>Status:</strong>{" "}
                  {order.status === "pending payment"
                    ? "Awaiting Payment"
                    : order.paymentMethod === "cashOnDelivery"
                      ? "Collect on Delivery"
                      : "Paid"}
                </Typography>
              </Box>
            </Paper>

            {/* Order Management */}
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order Management
              </Typography>
              <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
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
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="in transit">In Transit</MenuItem>
                  <MenuItem value="out for delivery">Out for Delivery</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
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
                size="small"
              >
                Save Status
              </Button>
            </Paper>
          </Grid>

          {/* ================= RIGHT COLUMN ================= */}
          <Grid item xs={12} md={6}>
            {/* Shipment Details */}
            <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: "#f5f5f5" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocalShippingIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Shipment Details
                  </Typography>
                </Box>
                <Chip
                  label={shipmentStatus.label}
                  color={shipmentStatus.color}
                  size="small"
                />
              </Box>

              {order.shiprocket?.shipmentId ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {/* AWB Error Alert - show when AWB is pending with error */}
                  {shipmentStatus.canRetryAwb && shipmentStatus.errorMessage && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight={600}>
                        AWB Assignment Failed
                      </Typography>
                      <Typography variant="caption" display="block">
                        {shipmentStatus.errorMessage}
                      </Typography>
                      {shipmentStatus.errorCode && (
                        <Typography variant="caption" color="text.secondary">
                          Error Code: {shipmentStatus.errorCode}
                        </Typography>
                      )}
                      {shipmentStatus.retryCount > 0 && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Retry attempts: {shipmentStatus.retryCount}
                        </Typography>
                      )}
                    </Alert>
                  )}

                  <Typography variant="body2">
                    <strong>Shiprocket Order ID:</strong> {order.shiprocket.orderId || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Shipment ID:</strong> {order.shiprocket.shipmentId}
                  </Typography>
                  <Typography variant="body2">
                    <strong>AWB / Tracking:</strong>{" "}
                    {order.shiprocket.awb || (
                      <span style={{ color: "#ed6c02" }}>Pending Assignment</span>
                    )}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Courier:</strong>{" "}
                    {order.shiprocket.courierName || (
                      <span style={{ color: "#9e9e9e" }}>Not assigned</span>
                    )}
                  </Typography>
                  {order.shiprocket.shipmentStatus && (
                    <Typography variant="body2">
                      <strong>Shipment Status:</strong> {order.shiprocket.shipmentStatus}
                    </Typography>
                  )}
                  {order.shiprocket.awbRetryCount > 0 && !order.shiprocket.awb && (
                    <Typography variant="caption" color="text.secondary">
                      Last attempt: {order.shiprocket.lastAwbAttempt
                        ? new Date(order.shiprocket.lastAwbAttempt).toLocaleString()
                        : "N/A"}
                    </Typography>
                  )}

                  <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                    {order.shiprocket.trackingUrl && (
                      <Button
                        variant="outlined"
                        size="small"
                        href={order.shiprocket.trackingUrl}
                        target="_blank"
                      >
                        Track Shipment
                      </Button>
                    )}
                    {order.shiprocket.labelUrl && (
                      <Button
                        variant="outlined"
                        size="small"
                        href={order.shiprocket.labelUrl}
                        target="_blank"
                      >
                        Print Label
                      </Button>
                    )}
                    {!order.shiprocket.awb && (
                      <Button
                        variant="contained"
                        size="small"
                        color="warning"
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                        onClick={handleRetryAwb}
                        disabled={loading}
                      >
                        {loading ? "Assigning..." : `Retry AWB${shipmentStatus.retryCount > 0 ? ` (${shipmentStatus.retryCount})` : ""}`}
                      </Button>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Shipment has not been created yet.
                  </Alert>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LocalShippingIcon />}
                    onClick={handleInitiateShipment}
                    disabled={!canCreateShipment() || loading}
                    fullWidth
                  >
                    {loading ? "Creating Shipment..." : "Create Shiprocket Shipment"}
                  </Button>
                  {!canCreateShipment() && order.status === "pending payment" && order.paymentMethod === "onlinePayment" && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                      Cannot create shipment - payment pending
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>

            {/* Order Summary */}
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order Summary
              </Typography>
              {order.note && (
                <Typography variant="body2" sx={{ mb: 2, fontStyle: "italic", color: "text.secondary" }}>
                  <strong>Note:</strong> {order.note}
                </Typography>
              )}
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">
                  ₹ {order.subtotal?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2">Delivery Charge:</Typography>
                <Typography variant="body2">
                  ₹ {order.deliveryCharge?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight={600}>Total:</Typography>
                <Typography variant="subtitle1" fontWeight={600} color="primary.main">
                  ₹ {order.totalAmount?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
            </Paper>
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
