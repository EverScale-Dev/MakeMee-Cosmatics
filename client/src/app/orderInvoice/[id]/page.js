"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Truck, ShoppingCart, CreditCard, ArrowRight } from "lucide-react";

const OrderInvoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Typography align="center" my={5}>
        Failed to load order details.
      </Typography>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", py: 6 }}>
      <Card
        sx={{
          maxWidth: 900,
          mx: "auto",
          borderRadius: 4,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Image src="/logo.webp" alt="Company Logo" width={120} height={50} />
            <Box textAlign="right">
              <Typography variant="h6" fontWeight="bold" color="primary">
                MakeMee Cosmatics 
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Derde Korhale, Kopargaon<br />
                Ahilyanagar, Maharashtra 423601
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Title */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Order Invoice
            </Typography>
            <Chip
              label={`Order ID: ${order.orderId}`}
              color="success"
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          {/* Shipping Info */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                color="primary"
              >
                Customer Information
              </Typography>
              <Typography>{order.customer.fullName}</Typography>
              <Typography>{order.customer.email}</Typography>
              <Typography>{order.customer.phone}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                color="primary"
              >
                Shipping Address
              </Typography>
              <Typography>
                {order.customer.shippingAddress.apartment_address},{" "}
                {order.customer.shippingAddress.street_address1}
              </Typography>
              <Typography>
                {order.customer.shippingAddress.city},{" "}
                {order.customer.shippingAddress.state} -{" "}
                {order.customer.shippingAddress.pincode}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 4 }} />

          {/* Order Summary */}
          <Box mb={4}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              color="primary"
            >
              <ShoppingCart size={20} style={{ marginRight: 6 }} /> Order Summary
            </Typography>
            {order.products.map((product) => (
              <Box
                key={product._id}
                display="flex"
                justifyContent="space-between"
                py={1.5}
                sx={{ borderBottom: "1px solid #eee" }}
              >
                <Box>
                  <Typography fontWeight="bold">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.quantity} × ₹{product.price.toFixed(2)}
                  </Typography>
                </Box>
                <Typography fontWeight="bold">
                  ₹{(product.quantity * product.price).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Charges */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="body1" fontWeight="medium">
              <Truck size={18} style={{ marginRight: 6 }} /> Delivery Charges
            </Typography>
            <Typography>
              ₹{order.deliveryCharges ? order.deliveryCharges.toFixed(2) : "0.00"}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Total */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography variant="h6" fontWeight="bold" color="primary">
              Total Amount
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              ₹{(order.totalAmount + (order.deliveryCharges || 0)).toFixed(2)}
            </Typography>
          </Box>

          {/* Payment */}
          <Box mb={3}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              color="primary"
            >
              <CreditCard size={18} style={{ marginRight: 6 }} /> Payment Status
            </Typography>
            <Chip label="Cash on Delivery" color="warning" variant="outlined" />
          </Box>

          {/* Actions */}
          <Box textAlign="center" mt={5}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                endIcon={<ArrowRight />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Continue Shopping
              </Button>
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderInvoice;
