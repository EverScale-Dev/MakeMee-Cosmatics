"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  CircularProgress,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import useAuth from "../withauth";

export default function AdminCustomerList() {
  useAuth();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState(null);
  const limit = 10;

  useEffect(() => {
    // Fetch token from localStorage and set it in the state
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // Fetch products and categories if token is available
    if (storedToken) {
      fetchCustomers();
    }
  }, []);

  // Fetch customers from API
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("customer data",res.data);
      setCustomers(res.data.customers);
      setTotalPages(Math.ceil(res.data.totalCount / limit)); // Calculate total pages
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Open modal with selected customer details
  const handleOpen = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
  };

  // Handle changes in the customer modal inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer({ ...selectedCustomer, [name]: value });
  };

  // Handle adding or updating a customer
  const handleSaveCustomer = async () => {
    try {
      if (selectedCustomer._id) {
        // Update customer
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/${selectedCustomer._id}`,
          selectedCustomer,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        // Add new customer
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers`,
          selectedCustomer,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      fetchCustomers();
      handleClose();
    } catch (err) {
      console.error("Error saving customer:", err);
    }
  };

  // Delete customer
  const handleCustomerDelete = async (customerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/${customerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchCustomers();
      } catch (err) {
        console.error("Error deleting customer:", err);
      }
    }
  };

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" gutterBottom>
          Customers List
        </Typography>

        {/* Add Customer Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedCustomer({
              fullName: "",
              email: "",
              phone: "",
              shippingAddress: {},
            });
            setOpen(true);
          }}
        >
          Add Customer
        </Button>
      </Box>

      {/* Customer Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Full Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Phone</strong>
              </TableCell>
              <TableCell>
                <strong>Shipping Address</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>{customer.fullName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    {customer.shippingAddress
                      ? `${customer.shippingAddress.address}, ${customer.shippingAddress.city}, ${customer.shippingAddress.state}, ${customer.shippingAddress.pincode}`
                      : "No Shipping Address"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(customer)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleCustomerDelete(customer._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages} // Total pages
          page={page} // Current page
          onChange={handlePageChange} // Handler for page change
        />
      </Box>

      {/* Customer Modal */}
      {selectedCustomer && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>
            {selectedCustomer._id ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
          <DialogContent>
            <Box my={2}>
              <TextField
                label="Full Name"
                fullWidth
                name="fullName"
                value={selectedCustomer.fullName || ""}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                label="Email"
                fullWidth
                name="email"
                value={selectedCustomer.email || ""}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                label="Phone"
                fullWidth
                name="phone"
                value={selectedCustomer.phone || ""}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                label="address"
                fullWidth
                name="address"
                value={selectedCustomer.shippingAddress.address || ""}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    shippingAddress: {
                      ...selectedCustomer.shippingAddress,
                      address: e.target.value,
                    },
                  })
                }
                margin="normal"
              />
              <TextField
                label="City"
                fullWidth
                name="city"
                value={selectedCustomer.shippingAddress.city || ""}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    shippingAddress: {
                      ...selectedCustomer.shippingAddress,
                      city: e.target.value,
                    },
                  })
                }
                margin="normal"
              />
              <TextField
                label="State"
                fullWidth
                name="state"
                value={selectedCustomer.shippingAddress.state || ""}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    shippingAddress: {
                      ...selectedCustomer.shippingAddress,
                      state: e.target.value,
                    },
                  })
                }
                margin="normal"
              />
              <TextField
                label="pincode"
                fullWidth
                name="pincode"
                value={selectedCustomer.shippingAddress.pincode || ""}
                onChange={(e) =>
                  setSelectedCustomer({
                    ...selectedCustomer,
                    shippingAddress: {
                      ...selectedCustomer.shippingAddress,
                      pincode: e.target.value,
                    },
                  })
                }
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSaveCustomer}
              variant="contained"
              color="primary"
            >
              {selectedCustomer._id ? "Save Changes" : "Add Customer"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
