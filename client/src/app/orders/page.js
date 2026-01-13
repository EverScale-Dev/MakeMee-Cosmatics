"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import api from "@/utils/axiosClient";
import Header from "@/components/header";
import Footer from "@/components/footer";

const statusColors = {
  "pending payment": "warning",
  processing: "info",
  "on hold": "default",
  completed: "success",
  refunded: "secondary",
  cancelled: "error",
  failed: "error",
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, _hydrated } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (_hydrated && !isAuthenticated) {
      router.push("/login?redirect=/orders");
    }
  }, [_hydrated, isAuthenticated, router]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      try {
        const res = await api.get("/api/orders/my");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (_hydrated && isAuthenticated) {
      fetchOrders();
    }
  }, [_hydrated, isAuthenticated]);

  if (!_hydrated || loading) {
    return (
      <>
        <Header />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress sx={{ color: "#731162" }} />
        </Box>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 900, mx: "auto", px: 3, py: 6, minHeight: "70vh" }}>
        <Typography variant="h4" fontWeight={700} mb={1} color="#333">
          My Orders
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          View and track your order history
        </Typography>

        {error && (
          <Box
            sx={{
              p: 3,
              mb: 3,
              bgcolor: "#fee2e2",
              borderRadius: 2,
              color: "#dc2626",
            }}
          >
            {error}
          </Box>
        )}

        {orders.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: "#f8f9fa",
              borderRadius: 3,
            }}
          >
            <ShoppingBagIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={2}>
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Start shopping to see your orders here
            </Typography>
            <Link href="/productpage">
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  px: 4,
                  py: 1.5,
                  bgcolor: "#731162",
                  color: "white",
                  borderRadius: 2,
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#5a0d4d" },
                }}
              >
                Browse Products
              </Box>
            </Link>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {orders.map((order) => (
              <Accordion
                key={order._id}
                sx={{
                  borderRadius: "12px !important",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  "&:before": { display: "none" },
                  overflow: "hidden",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ bgcolor: "#f8f9fa" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      pr: 2,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <LocalShippingIcon sx={{ color: "#731162" }} />
                      <Box>
                        <Typography fontWeight={600}>
                          Order #{order.orderId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip
                        label={order.status}
                        color={statusColors[order.status] || "default"}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                      <Typography fontWeight={700} color="#731162">
                        ₹{order.totalAmount?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  {/* Products */}
                  <Typography variant="subtitle2" fontWeight={600} mb={2}>
                    Items Ordered
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
                    {order.products?.map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 2,
                          bgcolor: "#f8f9fa",
                          borderRadius: 2,
                        }}
                      >
                        <Box>
                          <Typography fontWeight={500}>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                          </Typography>
                        </Box>
                        <Typography fontWeight={600}>
                          ₹{(item.quantity * item.price)?.toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Order Summary */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      pt: 2,
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Subtotal: ₹{order.subtotal?.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Delivery: ₹{order.deliveryCharge?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" color="text.secondary">
                        Payment: {order.paymentMethod === "onlinePayment" ? "Online" : "COD"}
                      </Typography>
                      <Typography fontWeight={700} color="#731162">
                        Total: ₹{order.totalAmount?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Shipping Address */}
                  {order.customer?.shippingAddress && (
                    <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #eee" }}>
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Shipping Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.customer.fullName}
                        <br />
                        {order.customer.shippingAddress.apartment_address &&
                          `${order.customer.shippingAddress.apartment_address}, `}
                        {order.customer.shippingAddress.street_address1}
                        <br />
                        {order.customer.shippingAddress.city},{" "}
                        {order.customer.shippingAddress.state} -{" "}
                        {order.customer.shippingAddress.pincode}
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Box>
      <Footer />
    </>
  );
}
