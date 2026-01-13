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
  Tooltip,
  AddIcon,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
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

  // Fetch token and customers
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken) {
      fetchCustomers(page);
    }
  }, [page]); // <-- fetch customers whenever page changes

  // Fetch customers function
  const fetchCustomers = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers`,
        {
          params: { page: pageNumber, limit },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCustomers(res.data.customers);
      setTotalPages(Math.ceil(res.data.totalCount / limit));
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination change
  const handlePageChange = (event, value) => {
    setPage(value); // this triggers useEffect to refetch customers
  };

  // Open modal
  const handleOpen = (customer = null) => {
    if (customer) {
      setSelectedCustomer(customer);
    } else {
      setSelectedCustomer({
        fullName: "",
        email: "",
        phone: "",
        shippingAddress: {
          apartment_address: "",
          street_address1: "",
          city: "",
          state: "",
          pincode: "",
          lat: 0,
          lng: 0,
        },
      });
    }
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
  };

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer({ ...selectedCustomer, [name]: value });
  };

  // Shipping address input change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer({
      ...selectedCustomer,
      shippingAddress: { ...selectedCustomer.shippingAddress, [name]: value },
    });
  };

  // Save customer
  const handleSaveCustomer = async () => {
    try {
      if (selectedCustomer._id) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/${selectedCustomer._id}`,
          selectedCustomer,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers`,
          selectedCustomer,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }
      fetchCustomers(page);
      handleClose();
    } catch (err) {
      console.error("Error saving customer:", err);
    }
  };

  // Delete customer
  const handleCustomerDelete = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/${customerId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchCustomers(page);
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  return (
    <Box p={4}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight={600}>
          Customers List
        </Typography>
        <Button
  variant="contained"
  color="primary"
  startIcon={<PersonAddAltIcon />} // 👈 adds icon before text
  sx={{
    borderRadius: "8px",
    textTransform: "none",
    px: 3,
    py: 1.2,
    boxShadow: 3,
    "&:hover": { boxShadow: 6 },
  }}
  onClick={() => handleOpen()}
>
  Add Customer
</Button>
      </Box>

      {/* Customer Table */}
      <TableContainer
        component={Paper}
        elevation={6}
        sx={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {["Full Name", "Email", "Phone", "Shipping Address", "Actions"].map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{ fontWeight: 600, color: "#333" }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow
                  key={customer._id}
                  sx={{
                    "&:hover": { backgroundColor: "#f9f9f9" },
                    cursor: "pointer",
                  }}
                >
                  <TableCell>{customer.fullName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>
                    <Tooltip
                      title={
                        customer.shippingAddress
                          ? `${customer.shippingAddress.apartment_address}, ${customer.shippingAddress.street_address1}, ${customer.shippingAddress.city}, ${customer.shippingAddress.state}, ${customer.shippingAddress.pincode}`
                          : "No Shipping Address"
                      }
                    >
                      <span
                        style={{
                          display: "block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {customer.shippingAddress
                          ? `${customer.shippingAddress.apartment_address}, ${customer.shippingAddress.street_address1}, ${customer.shippingAddress.city}, ${customer.shippingAddress.state}, ${customer.shippingAddress.pincode}`
                          : "No Shipping Address"}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      sx={{
                        "&:hover": { backgroundColor: "#e0f7fa" },
                      }}
                      onClick={() => handleOpen(customer)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      sx={{
                        ml: 1,
                        "&:hover": { backgroundColor: "#ffebee" },
                      }}
                      onClick={() => handleCustomerDelete(customer._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          sx={{ "& .MuiPaginationItem-root": { borderRadius: "6px" } }}
        />
      </Box>

      {/* Customer Modal */}
      {selectedCustomer && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle fontWeight={600}>
            {selectedCustomer._id ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
          <DialogContent>
            <Box my={2} display="flex" flexDirection="column" gap={2}>
              {[
                { label: "Full Name", name: "fullName" },
                { label: "Email", name: "email" },
                { label: "Phone", name: "phone" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  label={field.label}
                  fullWidth
                  name={field.name}
                  value={selectedCustomer[field.name]}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                />
              ))}

              {/* Shipping Address Fields */}
              {[
                { label: "Apartment Address", name: "apartment_address" },
                { label: "Street Address", name: "street_address1" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Pincode", name: "pincode" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  label={field.label}
                  fullWidth
                  name={field.name}
                  value={selectedCustomer.shippingAddress[field.name]}
                  onChange={handleAddressChange}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="secondary"
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCustomer}
              variant="contained"
              color="primary"
              sx={{ textTransform: "none" }}
            >
              {selectedCustomer._id ? "Save Changes" : "Add Customer"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
