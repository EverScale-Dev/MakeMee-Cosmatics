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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/metrics`, {
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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`, {
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
    <Box sx={{ p: { xs: 2, md: 2 }}}>
      {/* Dashboard Header */}
      {/* <Typography
        variant="h4"
        fontWeight="600"
        sx={{
          mb: 4,
          color: '#1e293b',
          textAlign: 'center',
          letterSpacing: 0.5,
        }}
      >
        Admin Dashboard
      </Typography> */}

      {/* Dashboard Metrics */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
        gap={3}
      >
        {/* Total Orders */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            },
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight="500">
              Total Orders
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
              <Typography variant="h4" fontWeight="700">
                {metrics.totalOrders}
              </Typography>
              <ShoppingCart fontSize="large" />
            </Box>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: '#fff',
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            },
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight="500">
              Total Products
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
              <Typography variant="h4" fontWeight="700">
                {metrics.totalProducts}
              </Typography>
              <Inventory fontSize="large" />
            </Box>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            },
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight="500">
              Total Customers
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
              <Typography variant="h4" fontWeight="700">
                {metrics.totalCustomers}
              </Typography>
              <People fontSize="large" />
            </Box>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
            color: '#fff',
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            },
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight="500">
              Total Revenue
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
              <Typography variant="h4" fontWeight="700">
                ₹{new Intl.NumberFormat('en-IN').format(metrics.totalRevenue)}
              </Typography>
              <CurrencyRupeeIcon fontSize="large" />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Orders Table */}
      <Box mt={6}>
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ mb: 2, color: '#1e293b' }}
        >
          Recent Orders
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow
                  key={order.orderId}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.customer?.fullName || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>₹ {order.totalAmount}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        display: 'inline-block',
                        borderRadius: '20px',
                        fontSize: 13,
                        fontWeight: 500,
                        backgroundColor:
                          order.status === 'completed'
                            ? 'rgba(34,197,94,0.1)'
                            : order.status === 'processing'
                            ? 'rgba(2,136,209,0.1)'
                            : order.status === 'on hold'
                            ? 'rgba(218,165,32,0.1)'
                            : order.status === 'pending payment'
                            ? 'rgba(255,165,0,0.1)'
                            : order.status === 'refunded'
                            ? 'rgba(0,128,128,0.1)'
                            : order.status === 'cancelled'
                            ? 'rgba(220,38,38,0.1)'
                            : order.status === 'failed'
                            ? 'rgba(107,114,128,0.1)'
                            : 'rgba(30,41,59,0.05)',
                      }}
                    >
                      {order.status}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3} textAlign="right">
          <Link href="/admin/orders" passHref>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '25px',
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 10px rgba(59,130,246,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 6px 14px rgba(59,130,246,0.4)',
                },
              }}
              endIcon={<ArrowForwardIos />}
            >
              View All Orders
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
