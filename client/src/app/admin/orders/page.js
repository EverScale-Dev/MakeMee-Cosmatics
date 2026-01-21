// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   IconButton,
//   CircularProgress,
//   Pagination,
//   Dialog,
//   DialogTitle,
//   DialogActions,
//   Button,
//   DialogContent,
//   DialogContentText,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import ShippingModal from "./ShippingModal";
// import OrderDetailModal from "./OrderDetailModal";
// import useAuth from "../withauth";

// export default function OrdersPage() {
//   useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [limit] = useState(10); // Orders per page
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [openShippingModal, setOpenShippingModal] = useState(false);
//   const [token, setToken] = useState(null); // State for token
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//     } else {
//       console.error("No token found. Redirecting...");
//     }
//   }, []);

//   useEffect(() => {
//     if (token) {
//       fetchOrders();
//     }
//   }, [token, page]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`,
//         {
//           params: { limit, skip: (page - 1) * limit },
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setOrders(response.data.orders); // Adjusted to match the response structure
//       setTotalOrders(response.data.totalOrders);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//     setLoading(false);
//   };

//   const handleViewOrder = async (orderId) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
//           },
//         }
//       );
//       console.log("response",response.data);
//       setSelectedOrder(response.data);
//       setOpen(true);

//       // Update orders list to reflect viewed status if needed
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === orderId ? { ...order, isViewed: true } : order
//         )
//       );
//     } catch (error) {
//       console.error("Error fetching order details:", error);
//     }
//     setLoading(false);
//   };

//   // Function to update order status
//   const updateOrderStatus = async (id, newStatus) => {
//     try {
//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${id}`,
//         {
//           status: newStatus,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setOpen(false);
//       fetchOrders();
//       // console.log('Order status updated:', response.data);
//     } catch (error) {
//       console.error(
//         "Error updating order status:",
//         error.response.data.message
//       );
//       alert("Failed to update order status.");
//     }
//   };

// // Handle opening the shipping modal
// const handleOpenShippingModal = async (orderId) => {
//   setLoading(true);
//   try {
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     setSelectedOrder(response.data); // Store order details in state
//     setOpenShippingModal(true); // Open the modal
//   } catch (error) {
//     console.error("Error fetching order details for shipping:", error);
//   } finally {
//     setLoading(false);
//   }
// };

// // Close the shipping modal
// const handleCloseShippingModal = () => {
//   setOpenShippingModal(false);
// };

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Orders
//       </Typography>

//       {/* Loading Indicator */}
//       {loading ? (
//         <Box display="flex" justifyContent="center" mt={2}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <>
//           {/* Orders Table */}
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     <strong>Order ID</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Customer</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Date</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Total Amount</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Status</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Actions</strong>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {orders.map((order) => (
//                   <TableRow
//                     key={order.orderId}
//                     sx={{
//                       backgroundColor: order.isViewed ? "#e0f7fa" : "#f9f9f9",
//                       fontWeight: order.isViewed ? "800" : "600",
//                     }}
//                   >
//                     <TableCell>{order.orderId}</TableCell>
//                     <TableCell>{order.customer?.fullName}</TableCell>
//                     <TableCell>
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell>₹ {order.totalAmount}</TableCell>
//                     <TableCell>{order.status}</TableCell>
//                     <TableCell>
//                       <IconButton onClick={() => handleViewOrder(order._id)}>
//                         <VisibilityIcon color="primary" />
//                       </IconButton>
//                       <IconButton
//                         onClick={() => handleOpenShippingModal(order._id)}
//                       >
//                         <LocalShippingIcon color="secondary" />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Pagination */}
//           <Box mt={2} display="flex" justifyContent="center">
//             <Pagination
//               count={Math.ceil(totalOrders / limit)}
//               page={page}
//               onChange={(event, value) => setPage(value)}
//             />
//           </Box>

//           {/* Order Detail Modal */}
//           {selectedOrder && (
//            <OrderDetailModal order={selectedOrder} open={open} onClose={() => setOpen(false)} onUpdateStatus={updateOrderStatus} />
//           )}

//          {/* Shipping Modal */}
//          {selectedOrder && (
//          <ShippingModal open={openShippingModal} handleClose={handleCloseShippingModal} order={selectedOrder} />
//         )}

//           {/* Snackbar for Cancel Order Result */}
//           <Snackbar
//             open={snackbarOpen}
//             autoHideDuration={4000} // Automatically close after 4 seconds
//             onClose={() => setSnackbarOpen(false)}
//             anchorOrigin={{ vertical: "top", horizontal: "center" }}
//           >
//             <Alert
//               onClose={() => setSnackbarOpen(false)}
//               severity="error"
//               sx={{ width: "100%" }}
//             >
//               {snackbarMessage}
//             </Alert>
//           </Snackbar>
//         </>
//       )}
//     </Box>
//   );
// }

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
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import Chip from "@mui/material/Chip";
import Swal from "sweetalert2";
import ShippingModal from "./ShippingModal";
import OrderDetailModal from "./OrderDetailModal";
import useAuth from "../withauth";

// Helper function to get shipment status for display
const getShipmentStatusBadge = (shiprocket) => {
  if (!shiprocket?.shipmentId) {
    return { label: "Not Created", color: "default" };
  }

  // Use internal status if available
  const internalStatus = shiprocket?.status;

  if (internalStatus === "pending_awb" || !shiprocket?.awb) {
    // Show error indicator if there's an error
    if (shiprocket?.awbErrorCode) {
      return { label: "AWB Error", color: "error" };
    }
    return { label: "AWB Pending", color: "warning" };
  }

  if (internalStatus === "ready" || shiprocket?.awb) {
    const shipmentStatus = shiprocket?.shipmentStatus?.toLowerCase() || "";
    if (shipmentStatus.includes("delivered")) {
      return { label: "Delivered", color: "success" };
    }
    if (shipmentStatus.includes("transit") || shipmentStatus.includes("out for")) {
      return { label: "In Transit", color: "info" };
    }
    if (shipmentStatus.includes("picked") || shipmentStatus.includes("shipped")) {
      return { label: "Shipped", color: "primary" };
    }
    return { label: "Ready", color: "success" };
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

  return { label: "Unknown", color: "default" };
};

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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`,
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}`,
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${id}`,
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shiprocket/ship/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Success alert
      Swal.fire({
        title: "Success!",
        text: "Order has been transferred to Shiprocket.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // setSelectedOrder(response.data); // Store order details in state
      // setOpenShippingModal(true); // Open the modal
    } catch (error) {
      console.error("Error fetching order details for shipping:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to transfer order to Shiprocket.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = async (awb) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shiprocket/track/${awb}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.tracking_data.track_url) {
        window.open(response.data.tracking_data.track_url, "_blank");
      } else {
        console.error(
          "Tracking failed:",
          response.message || "No track_url found"
        );
      }
    } catch (error) {
      console.error("Error tracking order:", error);
    }
  };

  // Close the shipping modal
  const handleCloseShippingModal = () => {
    setOpenShippingModal(false);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Orders List
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={30} />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            elevation={6}
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  {[
                    "Order ID",
                    "Customer",
                    "Date",
                    "Amount",
                    "Payment",
                    "Status",
                    "Shipment",
                    "Actions",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{ fontWeight: 600, color: "#333", whiteSpace: "nowrap" }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const shipmentBadge = getShipmentStatusBadge(order.shiprocket);
                    return (
                      <TableRow
                        key={order.orderId}
                        sx={{
                          backgroundColor: order.isViewed
                            ? "#ffffff"
                            : "#fffef0",
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600 }}>
                          #{order.orderId}
                        </TableCell>
                        <TableCell>
                          {order.customer?.fullName || "Guest"}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          ₹{order.totalAmount?.toFixed(0)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.paymentMethod === "cashOnDelivery" ? "COD" : "Online"}
                            color={order.paymentMethod === "cashOnDelivery" ? "warning" : "success"}
                            size="small"
                            sx={{ fontWeight: 500, fontSize: 11 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              fontSize: 11,
                              textTransform: "capitalize",
                              backgroundColor:
                                order.status === "completed" || order.status === "delivered"
                                  ? "rgba(34,197,94,0.15)"
                                  : order.status === "processing"
                                    ? "rgba(2,136,209,0.15)"
                                    : order.status === "shipped" || order.status === "in transit"
                                      ? "rgba(59,130,246,0.15)"
                                      : order.status === "on hold"
                                        ? "rgba(218,165,32,0.15)"
                                        : order.status === "pending payment"
                                          ? "rgba(255,165,0,0.15)"
                                          : order.status === "cancelled" || order.status === "failed"
                                            ? "rgba(220,38,38,0.15)"
                                            : "rgba(107,114,128,0.15)",
                              color:
                                order.status === "completed" || order.status === "delivered"
                                  ? "#166534"
                                  : order.status === "processing"
                                    ? "#0277bd"
                                    : order.status === "shipped" || order.status === "in transit"
                                      ? "#1d4ed8"
                                      : order.status === "on hold"
                                        ? "#92400e"
                                        : order.status === "pending payment"
                                          ? "#c2410c"
                                          : order.status === "cancelled" || order.status === "failed"
                                            ? "#dc2626"
                                            : "#374151",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={shipmentBadge.label}
                            color={shipmentBadge.color}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 500, fontSize: 11 }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleViewOrder(order._id)}
                            size="small"
                            sx={{ "&:hover": { backgroundColor: "#e3f2fd" } }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleOpenShippingModal(order._id)}
                            size="small"
                            disabled={!!order.shiprocket?.shipmentId}
                            sx={{ "&:hover": { backgroundColor: "#fff3e0" } }}
                          >
                            <LocalShippingIcon fontSize="small" />
                          </IconButton>
                          {order?.shiprocket?.awb && (
                            <IconButton
                              color="info"
                              onClick={() =>
                                handleTrackOrder(order.shiprocket.awb)
                              }
                              size="small"
                              sx={{ "&:hover": { backgroundColor: "#e1f5fe" } }}
                            >
                              <TrackChangesIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(totalOrders / limit)}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>

          {/* Order Detail Modal */}
          {selectedOrder && (
            <OrderDetailModal
              order={selectedOrder}
              open={open}
              onClose={() => setOpen(false)}
              onUpdateStatus={updateOrderStatus}
            />
          )}

          {/* Shipping Modal */}
          {selectedOrder && (
            <ShippingModal
              open={openShippingModal}
              handleClose={handleCloseShippingModal}
              order={selectedOrder}
            />
          )}

          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
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
