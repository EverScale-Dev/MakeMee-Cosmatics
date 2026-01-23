"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, syncCartToBackend } from "@/store/slices/cartSlice";
import Link from "next/link";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HomeIcon from "@mui/icons-material/Home";
import api from "@/utils/axiosClient";

function OrderSuccessInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const order_id = searchParams.get("order_id");

  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoiceStatus, setInvoiceStatus] = useState("pending"); // pending, sending, sent, error
  const invoiceSentRef = useRef(false);
  const cartClearedRef = useRef(false);

  // Clear cart on success page load (only once)
  useEffect(() => {
    if (!cartClearedRef.current && order_id) {
      dispatch(clearCart());
      dispatch(syncCartToBackend({ action: "clear", item: {} }));
      cartClearedRef.current = true;
    }
  }, [order_id, dispatch]);

  // Fetch order status
  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!order_id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/order-status/${order_id}`
        );
        const data = await res.json();
        setOrderStatus(data);
      } catch (error) {
        console.error("Failed to fetch order status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [order_id]);

  // Trigger invoice generation (only once)
  useEffect(() => {
    if (!orderStatus?.orderId || invoiceSentRef.current) return;

    const sendInvoice = async () => {
      invoiceSentRef.current = true;
      setInvoiceStatus("sending");

      try {
        const res = await api.post("/api/orders/generate-invoice", {
          orderId: orderStatus.orderId,
        });

        if (res.data.alreadySent) {
          setInvoiceStatus("sent");
        } else if (res.data.success) {
          setInvoiceStatus("sent");
        } else {
          setInvoiceStatus("error");
        }
      } catch (error) {
        console.error("Invoice generation failed:", error);
        setInvoiceStatus("error");
      }
    };

    sendInvoice();
  }, [orderStatus]);

  // Prevent back navigation
  useEffect(() => {
    const handlePopState = () => {
      router.push("/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
      >
        <CircularProgress sx={{ color: "#731162" }} />
        <Typography mt={2} color="text.secondary">
          Loading order details...
        </Typography>
      </Box>
    );
  }

  if (!orderStatus) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
      >
        <Typography variant="h6" color="error">
          Order not found
        </Typography>
        <Link href="/">
          <Button sx={{ mt: 2 }} variant="contained">
            Go to Home
          </Button>
        </Link>
      </Box>
    );
  }

  const { orderId, totalAmount, products, paymentMethod, createdAt, status } =
    orderStatus;

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        px: 3,
        py: 6,
        minHeight: "80vh",
      }}
    >
      {/* Success Header */}
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
          p: 4,
          bgcolor: "#f0fdf4",
          borderRadius: 3,
          border: "1px solid #bbf7d0",
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 70,
            color: "#16a34a",
            mb: 2,
            animation: "bounce 0.5s ease-in-out",
          }}
        />
        <Typography variant="h4" fontWeight={700} color="#166534" gutterBottom>
          {paymentMethod === "onlinePayment"
            ? "Payment Successful!"
            : "Order Placed!"}
        </Typography>
        <Typography color="#166534">
          Thank you for shopping with MakeMee Cosmetics
        </Typography>
      </Box>

      {/* Order Details Card */}
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
          mb: 4,
        }}
      >
        <Box sx={{ p: 3, bgcolor: "#f8f9fa", borderBottom: "1px solid #eee" }}>
          <Typography variant="h6" fontWeight={600}>
            Order Details
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Order ID
              </Typography>
              <Typography fontWeight={600}>#{orderId}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Typography fontWeight={600} sx={{ textTransform: "capitalize" }}>
                {status}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Date
              </Typography>
              <Typography fontWeight={600}>
                {new Date(createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Payment Method
              </Typography>
              <Typography fontWeight={600}>
                {paymentMethod === "onlinePayment"
                  ? "Online Payment"
                  : "Cash on Delivery"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Products */}
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Items Ordered ({products?.length || 0})
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {products?.map((item, idx) => (
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
                    Qty: {item.quantity}
                  </Typography>
                </Box>
                <Typography fontWeight={600}>₹{item.price}</Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Total */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              bgcolor: "#731162",
              borderRadius: 2,
              color: "white",
            }}
          >
            <Typography fontWeight={600}>Total Amount</Typography>
            <Typography variant="h5" fontWeight={700}>
              ₹{totalAmount}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Invoice Status */}
      <Box
        sx={{
          p: 3,
          bgcolor:
            invoiceStatus === "sent"
              ? "#f0fdf4"
              : invoiceStatus === "error"
              ? "#fef2f2"
              : "#f8f9fa",
          borderRadius: 2,
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <ReceiptIcon
          sx={{
            color:
              invoiceStatus === "sent"
                ? "#16a34a"
                : invoiceStatus === "error"
                ? "#dc2626"
                : "#666",
          }}
        />
        <Box>
          <Typography fontWeight={600}>
            {invoiceStatus === "sending" && "Sending invoice..."}
            {invoiceStatus === "sent" && "Invoice sent to your email"}
            {invoiceStatus === "error" && "Failed to send invoice"}
            {invoiceStatus === "pending" && "Preparing invoice..."}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {invoiceStatus === "sent" &&
              "Check your inbox for order confirmation and invoice"}
            {invoiceStatus === "error" &&
              "Please contact support if you need an invoice"}
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Link href="/orders" style={{ flex: 1 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShoppingBagIcon />}
            sx={{
              py: 1.5,
              bgcolor: "#731162",
              "&:hover": { bgcolor: "#5a0d4d" },
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            View My Orders
          </Button>
        </Link>
        <Link href="/" style={{ flex: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<HomeIcon />}
            sx={{
              py: 1.5,
              borderColor: "#731162",
              color: "#731162",
              "&:hover": { borderColor: "#5a0d4d", bgcolor: "#f8f4f7" },
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Continue Shopping
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress sx={{ color: "#731162" }} />
        </Box>
      }
    >
      <OrderSuccessInner />
    </Suspense>
  );
}
