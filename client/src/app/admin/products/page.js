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
  Snackbar,
  Alert, 
  MenuItem,
  FormControl,
  Select,
  TextField,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import useAuth from "../withauth";

function SingleProductList() {
  useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [token, setToken] = useState(null);
  
  // NEW/MODIFIED: State for Snackbar (Toast) feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success', 'error'

  useEffect(() => {
    // Fetch token from localStorage and set it in the state
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // Fetch products if token is available
    if (storedToken) {
      fetchProducts();
    }
  }, [token]); // NEW/MODIFIED: Added token to dependency array to ensure fetch runs after token is set

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open modal with selected product details
  const handleOpen = (product) => {
    setSelectedProduct({
      ...product,
    });
    setImages([]);
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setImages([]);
  };

  // NEW/MODIFIED: Function to close the Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Update product details in modal
  const handleProductUpdate = async () => {
    const formData = new FormData();
    formData.append("name", selectedProduct.name);
    formData.append("description", selectedProduct.description);
    formData.append("regularPrice", selectedProduct.regularPrice);
    formData.append("salePrice", selectedProduct.salePrice);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${selectedProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts();
      handleClose();
      // NEW/MODIFIED: Show success message
      setSnackbarMessage("Product updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error updating product:", err);
      // NEW/MODIFIED: Show error message
      setSnackbarMessage(`Error updating product: ${err.response?.data?.message || err.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle changes in the product modal inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Delete product
  const handleProductDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchProducts();
        // NEW/MODIFIED: Show success message for deletion
        setSnackbarMessage("Product deleted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (err) {
        console.error("Error deleting product:", err);
        // NEW/MODIFIED: Show error message for deletion
        setSnackbarMessage(`Error deleting product: ${err.response?.data?.message || err.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  // Handle adding a new product
  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("name", selectedProduct.name);
    formData.append("description", selectedProduct.description);
    formData.append("regularPrice", selectedProduct.regularPrice);
    formData.append("salePrice", selectedProduct.salePrice);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts();
      handleClose();
      // NEW/MODIFIED: Show success message
      setSnackbarMessage("Product added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error adding product:", err);
      // NEW/MODIFIED: Show error message
      setSnackbarMessage(`Error adding product: ${err.response?.data?.message || err.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Products List</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedProduct({});
            setOpen(true);
          }}
          sx={{ mr: 2 }}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Product Name</strong>
              </TableCell>
              <TableCell>
                <strong>Image</strong>
              </TableCell>
              <TableCell>
                <strong>Regular Price</strong>
              </TableCell>
              <TableCell>
                <strong>Sale Price</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`${product.images[0]}`}
                        alt={product.name}
                        width={50}
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>
                  <TableCell>₹ {product.regularPrice}</TableCell>
                  <TableCell>₹ {product.salePrice || "-"}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(product)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleProductDelete(product._id)}
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

      {/* Product Modal */}
      {selectedProduct && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>
            {selectedProduct._id ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <DialogContent>
            <Box my={2}>
              <TextField
                label="Product Name"
                fullWidth
                name="name"
                value={selectedProduct.name || ""}
                onChange={handleInputChange}
                margin="normal"
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                name="description"
                value={selectedProduct.description || ""}
                onChange={handleInputChange}
                margin="normal"
              />
              <Box display="flex" gap={2}>
                <TextField
                  label="Regular Price"
                  fullWidth
                  name="regularPrice"
                  type="number"
                  value={selectedProduct.regularPrice || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  label="Sale Price"
                  fullWidth
                  name="salePrice"
                  type="number"
                  value={selectedProduct.salePrice || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Box>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ marginTop: "1rem" }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={
                selectedProduct._id ? handleProductUpdate : handleAddProduct
              }
              color="primary"
            >
              {selectedProduct._id ? "Update Product" : "Add Product"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* NEW/MODIFIED: Snackbar component for displaying success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Auto-hide after 6 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // Position
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SingleProductList;