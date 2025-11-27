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
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  CircularProgress,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import useAuth from "../withauth";

function SingleProductList() {
  useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // NEW: State for Categories
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // New files to upload
  const [token, setToken] = useState(null);

  // State for Snackbar (Toast) feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success', 'error'
  const [draggingIndex, setDraggingIndex] = React.useState(null);
  const [dropIndex, setDropIndex] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken) {
      fetchProducts(storedToken);
      fetchCategories(storedToken); // NEW: Fetch categories on load
    }
  }, []);

  // NEW: Fetch categories from API (Assumes an endpoint for categories)
  const fetchCategories = async (token) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch products from API
  const fetchProducts = async (tokenOverride = token) => {
    if (!tokenOverride) return;
    setLoading(true);
    try {
      // Products now have category populated (name)
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`,
        {
          headers: { Authorization: `Bearer ${tokenOverride}` },
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
      // Ensure complex arrays exist for the form logic
      features: product.features || [],
      ingredients: product.ingredients || [],
      // Ensure category is ID, not object if your API returns the populated object
      category:
        typeof product.category === "object"
          ? product.category._id
          : product.category || "",
    });
    setImages([]); // Clear files for upload
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setImages([]);
  };

  // Function to close the Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Remove existing image (for UPDATE only)
  const handleRemoveExistingImage = (imgUrl) => {
    if (selectedProduct._id) {
      setSelectedProduct((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img !== imgUrl),
      }));
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

  // Handle image uploads (for new files)
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // NEW: Handle changes for features/ingredients array fields
  const handleArrayChange = (arrayName, index, field, value) => {
    setSelectedProduct((prevProduct) => {
      const newArray = [...prevProduct[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prevProduct,
        [arrayName]: newArray,
      };
    });
  };

  // NEW: Add new empty feature/ingredient
  const handleAddArrayItem = (arrayName, defaultItem) => {
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [arrayName]: [...prevProduct[arrayName], defaultItem],
    }));
  };

  // NEW: Remove feature/ingredient by index
  const handleRemoveArrayItem = (arrayName, index) => {
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [arrayName]: prevProduct[arrayName].filter((_, i) => i !== index),
    }));
  };

  // Prepare FormData for both Add and Update
  const prepareFormData = () => {
    const formData = new FormData();

    // Core Fields
    formData.append("name", selectedProduct.name || "");
    formData.append("brand", selectedProduct.brand || ""); // NEW
    formData.append("description", selectedProduct.description || "");
    formData.append("shortDescription", selectedProduct.shortDescription || ""); // NEW
    formData.append("sourcingInfo", selectedProduct.sourcingInfo || ""); // NEW
    formData.append("regularPrice", selectedProduct.regularPrice || 0);
    formData.append("salePrice", selectedProduct.salePrice || 0);
    formData.append("badge", selectedProduct.badge || "");
    formData.append("weight", selectedProduct.weight || "");
    formData.append("rating", selectedProduct.rating || 0);
    formData.append("reviews", selectedProduct.reviews || 0);

    // Complex Fields (Stringified JSON)
    formData.append("features", JSON.stringify(selectedProduct.features || []));
    formData.append(
      "ingredients",
      JSON.stringify(selectedProduct.ingredients || [])
    );

    // Existing Images (ONLY for Update)
    if (selectedProduct._id) {
      // Send the list of image URLs that the user kept
      formData.append(
        "existingImages",
        JSON.stringify(selectedProduct.images || [])
      );
    }

    // New Images to Upload
    images.forEach((image) => {
      formData.append("images", image);
    });

    return formData;
  };

  // Update product details in modal
  const handleProductUpdate = async () => {
    const formData = prepareFormData();

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${selectedProduct._id}`,
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
      setSnackbarMessage("Product updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error updating product:", err);
      setSnackbarMessage(
        `Error updating product: ${err.response?.data?.message || err.message}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle adding a new product
  const handleAddProduct = async () => {
    const formData = prepareFormData();

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`,
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
      setSnackbarMessage("Product added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error adding product:", err);
      setSnackbarMessage(
        `Error adding product: ${err.response?.data?.message || err.message}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Delete product
  const handleProductDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchProducts();
        setSnackbarMessage("Product deleted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (err) {
        console.error("Error deleting product:", err);
        setSnackbarMessage(
          `Error deleting product: ${err.response?.data?.message || err.message}`
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleDragStart = (e, index) => {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === dropIndex) return;

    setSelectedProduct((prev) => {
      const updated = [...prev.images];
      const [movedImage] = updated.splice(draggingIndex, 1);
      updated.splice(dropIndex, 0, movedImage);
      return { ...prev, images: updated };
    });

    setDraggingIndex(null);
  };

  return (
    <Box p={4}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight={600}>
          Products List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Inventory2Icon />} // 👈 icon fits “Product”
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.2,
            textTransform: "none",
            boxShadow: 3,
            "&:hover": { boxShadow: 6 },
          }}
          onClick={() => {
            setSelectedProduct({
              name: "",
              brand: "",
              regularPrice: 0,
              salePrice: 0,
              description: "",
              shortDescription: "",
              sourcingInfo: "",
              badge: "",
              weight: "",
              rating: 4.5,
              reviews: 0,
              images: [],
              features: [],
              ingredients: [],
            });
            setOpen(true);
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Products Table */}
      <TableContainer
        component={Paper}
        elevation={6}
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {[
                "Product Name",
                "Regular Price",
                "Sale Price",
                "Badge",
                "Actions",
              ].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 600, color: "#333" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : products.length > 0 ? (
              products.map((product) => (
                <TableRow
                  key={product._id}
                  sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          width={40}
                          height={40}
                          style={{
                            marginRight: 12,
                            borderRadius: 4,
                            objectFit: "cover",
                          }}
                        />
                      )}
                      {product.name}
                    </Box>
                  </TableCell>
                  <TableCell>₹ {product.regularPrice}</TableCell>
                  <TableCell>₹ {product.salePrice || "-"}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        display: "inline-block",
                        borderRadius: "20px",
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        backgroundColor:
                          product.badge === "NEW LAUNCH"
                            ? "rgba(59,130,246,0.15)"
                            : product.badge === "BEST SELLER"
                              ? "rgba(34,197,94,0.15)"
                              : product.badge === "DISCOUNT"
                                ? "rgba(249,115,22,0.15)"
                                : product.badge === "LIMITED"
                                  ? "rgba(217,70,239,0.15)"
                                  : product.badge === "HOT"
                                    ? "rgba(239,68,68,0.15)"
                                    : "rgba(107,114,128,0.1)",
                        color:
                          product.badge === "NEW LAUNCH"
                            ? "#1e3a8a"
                            : product.badge === "BEST SELLER"
                              ? "#166534"
                              : product.badge === "DISCOUNT"
                                ? "#9a3412"
                                : product.badge === "LIMITED"
                                  ? "#86198f"
                                  : product.badge === "HOT"
                                    ? "#991b1b"
                                    : "#374151",
                      }}
                    >
                      {product.badge || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(product)}
                      sx={{ "&:hover": { backgroundColor: "#e0f7fa" } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleProductDelete(product._id)}
                      sx={{ ml: 1, "&:hover": { backgroundColor: "#ffebee" } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Modal */}
      {selectedProduct && (
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="lg"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              fontSize: "1.4rem",
              color: "#1e293b",
              background: "linear-gradient(90deg, #fdf2f8 0%, #fce7f3 100%)",
              borderBottom: "1px solid #f1f1f1",
              py: 2,
              px: 3,
            }}
          >
            {selectedProduct._id ? "Edit Product" : "Add New Product"}
          </DialogTitle>

          <DialogContent
            dividers
            sx={{
              backgroundColor: "#fafafa",
              px: 3,
              py: 3,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {/* Core Info */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1d4ed8",
                    fontWeight: 700,
                    mb: 2,
                    borderBottom: "2px solid #e0e0e0",
                    pb: 0.5,
                  }}
                >
                  Core Information
                </Typography>

                <Box display="flex" gap={2}>
                  <TextField
                    label="Product Name"
                    fullWidth
                    name="name"
                    value={selectedProduct.name}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                  <TextField
                    label="Brand Name"
                    fullWidth
                    name="brand"
                    value={selectedProduct.brand}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                </Box>

                <Box display="flex" gap={2} mt={2}>
                  <FormControl fullWidth>
                    <InputLabel id="badge-label">Badge</InputLabel>
                    <Select
                      labelId="badge-label"
                      id="badge"
                      name="badge"
                      value={selectedProduct.badge}
                      onChange={handleInputChange}
                      label="Badge"
                      sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="NEW LAUNCH">NEW LAUNCH</MenuItem>
                      <MenuItem value="BEST SELLER">BEST SELLER</MenuItem>
                      <MenuItem value="DISCOUNT">DISCOUNT</MenuItem>
                      <MenuItem value="LIMITED">LIMITED</MenuItem>
                      <MenuItem value="HOT">HOT</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box mt={2} display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Short Description"
                    fullWidth
                    multiline
                    rows={2}
                    name="shortDescription"
                    value={selectedProduct.shortDescription}
                    onChange={handleInputChange}
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                  <TextField
                    label="Detailed Description"
                    fullWidth
                    multiline
                    rows={4}
                    name="description"
                    value={selectedProduct.description}
                    onChange={handleInputChange}
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                  <TextField
                    label="Sourcing & Ingredients Info"
                    fullWidth
                    multiline
                    rows={3}
                    name="sourcingInfo"
                    value={selectedProduct.sourcingInfo}
                    onChange={handleInputChange}
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                </Box>
              </Box>

              {/* Pricing & Metrics */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1d4ed8",
                    fontWeight: 700,
                    mb: 2,
                    borderBottom: "2px solid #e0e0e0",
                    pb: 0.5,
                  }}
                >
                  Pricing & Metrics
                </Typography>

                <Box display="flex" gap={2}>
                  <TextField
                    label="Regular Price"
                    fullWidth
                    type="number"
                    name="regularPrice"
                    value={selectedProduct.regularPrice}
                    onChange={handleInputChange}
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                  <TextField
                    label="Sale Price"
                    fullWidth
                    type="number"
                    name="salePrice"
                    value={selectedProduct.salePrice}
                    onChange={handleInputChange}
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                </Box>

                <Box display="flex" gap={2} mt={2}>
                  <TextField
                    label="Weight"
                    fullWidth
                    name="weight"
                    value={selectedProduct.weight}
                    onChange={handleInputChange}
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                  <TextField
                    label="Rating"
                    fullWidth
                    type="number"
                    inputProps={{ step: 0.1, min: 0, max: 5 }}
                    name="rating"
                    value={selectedProduct.rating}
                    onChange={handleInputChange}
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                  <TextField
                    label="Reviews Count"
                    fullWidth
                    type="number"
                    inputProps={{ step: 1, min: 0 }}
                    name="reviews"
                    value={selectedProduct.reviews}
                    onChange={handleInputChange}
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                  />
                </Box>
              </Box>

              {/* Features */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1d4ed8",
                    fontWeight: 700,
                    mb: 2,
                    borderBottom: "2px solid #e0e0e0",
                    pb: 0.5,
                  }}
                >
                  Key Features / Benefits
                </Typography>

                {selectedProduct.features.map((feature, index) => (
                  <Box
                    key={index}
                    display="flex"
                    gap={2}
                    alignItems="center"
                    mb={1}
                  >
                    <TextField
                      fullWidth
                      value={feature.text}
                      onChange={(e) =>
                        handleArrayChange(
                          "features",
                          index,
                          "text",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveArrayItem("features", index)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  startIcon={<AddIcon />}
                  onClick={() =>
                    handleAddArrayItem("features", { text: "", iconName: "" })
                  }
                  variant="outlined"
                  sx={{
                    borderRadius: 20,
                    fontWeight: 600,
                    textTransform: "none",
                    mt: 1,
                  }}
                >
                  Add Feature
                </Button>
              </Box>

              {/* Ingredients */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1d4ed8",
                    fontWeight: 700,
                    mb: 2,
                    borderBottom: "2px solid #e0e0e0",
                    pb: 0.5,
                  }}
                >
                  Key Ingredients
                </Typography>

                {selectedProduct.ingredients.map((ingredient, index) => (
                  <Box
                    key={index}
                    display="flex"
                    gap={2}
                    alignItems="center"
                    mb={1}
                  >
                    <TextField
                      fullWidth
                      value={ingredient.name}
                      onChange={(e) =>
                        handleArrayChange(
                          "ingredients",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                    />
                    <TextField
                      fullWidth
                      value={ingredient.benefit}
                      onChange={(e) =>
                        handleArrayChange(
                          "ingredients",
                          index,
                          "benefit",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                    />
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleRemoveArrayItem("ingredients", index)
                      }
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  startIcon={<AddIcon />}
                  onClick={() =>
                    handleAddArrayItem("ingredients", { name: "", benefit: "" })
                  }
                  variant="outlined"
                  sx={{
                    borderRadius: 20,
                    fontWeight: 600,
                    textTransform: "none",
                    mt: 1,
                  }}
                >
                  Add Ingredient
                </Button>
              </Box>

              {/* Images Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1d4ed8",
                    fontWeight: 700,
                    mb: 2,
                    borderBottom: "2px solid #e0e0e0",
                    pb: 0.5,
                  }}
                >
                  Images
                </Typography>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ marginBottom: "12px" }}
                />

                {/* Image Thumbnails with native drag & drop + ghost drop preview */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    position: "relative",
                    minHeight: 100,
                  }}
                >
                  {selectedProduct.images.map((img, index) => (
                    <Box
                      key={index}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("dragIndex", index);
                        e.currentTarget.classList.add("dragging");
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove("dragging");
                        setDropIndex(null);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDropIndex(index);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const dragIndex = Number(
                          e.dataTransfer.getData("dragIndex")
                        );
                        const dropIndex = index;
                        if (dragIndex === dropIndex) return;

                        const reordered = [...selectedProduct.images];
                        const [moved] = reordered.splice(dragIndex, 1);
                        reordered.splice(dropIndex, 0, moved);
                        setSelectedProduct((prev) => ({
                          ...prev,
                          images: reordered,
                        }));
                        setDropIndex(null);
                      }}
                      sx={{
                        position: "relative",
                        width: 90,
                        height: 90,
                        borderRadius: 2,
                        overflow: "hidden",
                        border:
                          dropIndex === index ? "2px dashed #2563eb" : "none",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        background: "#fff",
                        transition: "all 0.2s ease",
                        opacity: 1,
                        "&.dragging": {
                          opacity: 0.3,
                          transform: "scale(0.95)",
                        },
                      }}
                    >
                      <img
                        src={img}
                        alt={`img-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          background: "rgba(255,255,255,0.7)",
                          "&:hover": { background: "rgba(255,255,255,1)" },
                        }}
                        onClick={() => handleRemoveExistingImage(img)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "space-between",
              px: 3,
              py: 2,
              background: "#f9fafb",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: 20, px: 3 }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                selectedProduct._id ? handleProductUpdate : handleAddProduct
              }
              variant="contained"
              sx={{
                color: "primary",
                fontWeight: 600,
                px: 3,
                borderRadius: 20,
              }}
            >
              {selectedProduct._id ? "Update Product" : "Add Product"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
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
