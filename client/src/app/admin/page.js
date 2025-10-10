"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button
} from '@mui/material';
import { ArrowForwardIos, People, Inventory, ShoppingCart } from '@mui/icons-material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { blue, green, red, purple } from '@mui/material/colors';
import useAuth from '../admin/withauth';

export default function AdminDashboard() {
  useAuth();

  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });

  const [orders, setOrders] = useState([]);

  // Fetch metrics data
  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/metrics`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
        },
      });
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  // Fetch recent orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Attach the token in the Authorization header
        },
    });
      setOrders(response.data.orders.slice(0, 5));
      console.log("order details",response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchOrders();
  }, []);

  return (
    <div>
      {/* Dashboard Metrics */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {/* Total Orders Card */}
        <Box flex="1 1 200px">
          <Card sx={{ backgroundColor: blue[500], color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Orders
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" component="div">{metrics.totalOrders}</Typography>
                <ShoppingCart fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Total Products Card */}
        <Box flex="1 1 200px">
          <Card sx={{ backgroundColor: green[500], color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Products
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" component="div">{metrics.totalProducts}</Typography>
                <Inventory fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Total Customers Card */}
        <Box flex="1 1 200px">
          <Card sx={{ backgroundColor: red[500], color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Customers
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" component="div">{metrics.totalCustomers}</Typography>
                <People fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Total Revenue Card */}
        <Box flex="1 1 200px">
          <Card sx={{ backgroundColor: purple[500], color: '#fff' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Revenue
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" component="div">Rs.{new Intl.NumberFormat('en-IN').format(metrics.totalRevenue)}</Typography>
                <CurrencyRupeeIcon fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Orders Table */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Recent Orders
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={order.orderId} sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.customer?.fullName || "N/A"}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>₹ {order.totalAmount}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} textAlign="right">
          <Link href="/admin/orders" passHref>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIos />}
          >
            View All Orders
          </Button>
          </Link>
        </Box>
      </Box>
    </div>
  );
}
