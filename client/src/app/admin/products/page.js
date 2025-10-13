// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Typography,
//   Snackbar,
//   Alert,
//   InputLabel,
//   MenuItem,
//   FormControl,
//   Select,
//   TextField,
//   CircularProgress,
//   Checkbox,
//   FormControlLabel,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";
// import useAuth from "../withauth";

// function SingleProductList() {
//   useAuth();
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [images, setImages] = useState([]);
//   const [token, setToken] = useState(null);

//   // NEW/MODIFIED: State for Snackbar (Toast) feedback
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success', 'error'

//   useEffect(() => {
//     // Fetch token from localStorage and set it in the state
//     const storedToken = localStorage.getItem("token");
//     setToken(storedToken);

//     // Fetch products if token is available
//     if (storedToken) {
//       fetchProducts();
//     }
//   }, [token]); // NEW/MODIFIED: Added token to dependency array to ensure fetch runs after token is set

//   // Fetch products from API
//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Open modal with selected product details
//   const handleOpen = (product) => {
//     setSelectedProduct({
//       ...product,
//     });
//     setImages([]);
//     setOpen(true);
//   };

//   // Close the modal
//   const handleClose = () => {
//     setOpen(false);
//     setSelectedProduct(null);
//     setImages([]);
//   };

//   // NEW/MODIFIED: Function to close the Snackbar
//   const handleSnackbarClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   // Update product details in modal
//   const handleProductUpdate = async () => {
//     const formData = new FormData();
//     formData.append("name", selectedProduct.name);
//     formData.append("description", selectedProduct.description);
//     formData.append("regularPrice", selectedProduct.regularPrice);
//     formData.append("salePrice", selectedProduct.salePrice);
//     formData.append("badge", selectedProduct.badge);
//     formData.append("weight", selectedProduct.weight);
//     formData.append("rating", selectedProduct.rating);
//     formData.append("reviews", selectedProduct.reviews);


//     images.forEach((image) => {
//       formData.append("images", image);
//     });

//     try {
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${selectedProduct._id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       fetchProducts();
//       handleClose();
//       // NEW/MODIFIED: Show success message
//       setSnackbarMessage("Product updated successfully!");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);
//     } catch (err) {
//       console.error("Error updating product:", err);
//       // NEW/MODIFIED: Show error message
//       setSnackbarMessage(
//         `Error updating product: ${err.response?.data?.message || err.message}`
//       );
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     }
//   };

//   // Handle changes in the product modal inputs
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     setSelectedProduct((prevProduct) => ({
//       ...prevProduct,
//       [name]: value,
//     }));
//   };

//   // Handle image uploads
//   const handleImageChange = (e) => {
//     setImages([...e.target.files]);
//   };

//   // Delete product
//   const handleProductDelete = async (productId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this product?"
//     );
//     if (confirmDelete) {
//       try {
//         await axios.delete(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         fetchProducts();
//         // NEW/MODIFIED: Show success message for deletion
//         setSnackbarMessage("Product deleted successfully!");
//         setSnackbarSeverity("success");
//         setSnackbarOpen(true);
//       } catch (err) {
//         console.error("Error deleting product:", err);
//         // NEW/MODIFIED: Show error message for deletion
//         setSnackbarMessage(
//           `Error deleting product: ${err.response?.data?.message || err.message}`
//         );
//         setSnackbarSeverity("error");
//         setSnackbarOpen(true);
//       }
//     }
//   };

//   // Handle adding a new product
//   const handleAddProduct = async () => {
//     const formData = new FormData();
//     formData.append("name", selectedProduct.name);
//     formData.append("description", selectedProduct.description);
//     formData.append("regularPrice", selectedProduct.regularPrice);
//     formData.append("salePrice", selectedProduct.salePrice);
//     formData.append("badge", selectedProduct.badge);
//     formData.append("weight", selectedProduct.weight);
//     formData.append("rating", selectedProduct.rating);
//     formData.append("reviews", selectedProduct.reviews);

//     images.forEach((image) => {
//       formData.append("images", image);
//     });

//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       fetchProducts();
//       handleClose();
//       // NEW/MODIFIED: Show success message
//       setSnackbarMessage("Product added successfully!");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);
//     } catch (err) {
//       console.error("Error adding product:", err);
//       // NEW/MODIFIED: Show error message
//       setSnackbarMessage(
//         `Error adding product: ${err.response?.data?.message || err.message}`
//       );
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     }
//   };

//   return (
//     <Box p={2}>
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h4">Products List</Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => {
//             setSelectedProduct({});
//             setOpen(true);
//           }}
//           sx={{ mr: 2 }}
//         >
//           Add Product
//         </Button>
//       </Box>

//       <TableContainer component={Paper} elevation={3}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <strong>Product Name</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Image</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Regular Price</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Sale Price</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Actions</strong>
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   <CircularProgress />
//                 </TableCell>
//               </TableRow>
//             ) : (
//               products.map((product) => (
//                 <TableRow key={product._id}>
//                   <TableCell>{product.name}</TableCell>
//                   <TableCell>
//                     {product.images && product.images.length > 0 ? (
//                       <img
//                         src={`${product.images[0]}`}
//                         alt={product.name}
//                         width={50}
//                       />
//                     ) : (
//                       "No Image"
//                     )}
//                   </TableCell>
//                   <TableCell>₹ {product.regularPrice}</TableCell>
//                   <TableCell>₹ {product.salePrice || "-"}</TableCell>
//                   <TableCell>
//                     <IconButton
//                       color="primary"
//                       onClick={() => handleOpen(product)}
//                     >
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton
//                       color="error"
//                       onClick={() => handleProductDelete(product._id)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Product Modal */}
//       {selectedProduct && (
//         <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
//           <DialogTitle className="font-bold text-lg">
//             {selectedProduct._id ? "Edit Product" : "Add New Product"}
//           </DialogTitle>

//           <DialogContent dividers>
//             <Box
//               component="form"
//               sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
//             >
//               {/* Product Name */}
//               <TextField
//                 label="Product Name"
//                 fullWidth
//                 name="name"
//                 value={selectedProduct.name || ""}
//                 onChange={handleInputChange}
//               />

//               {/* Badge, Weight, and Rating */}
//               <Box display="flex" gap={2}>
//                 <FormControl fullWidth>
//                   <InputLabel id="badge-label">Badge</InputLabel>
//                   <Select
//                     labelId="badge-label"
//                     id="badge"
//                     name="badge"
//                     value={selectedProduct.badge || ""}
//                     label="Badge"
//                     onChange={handleInputChange}
//                   >
//                     <MenuItem value="">None</MenuItem>
//                     <MenuItem value="NEW LAUNCH">NEW LAUNCH</MenuItem>
//                     <MenuItem value="BEST SELLER">BEST SELLER</MenuItem>
//                     <MenuItem value="DISCOUNT">DISCOUNT</MenuItem>
//                     <MenuItem value="LIMITED">LIMITED</MenuItem>
//                     <MenuItem value="HOT">HOT</MenuItem>
//                   </Select>
//                 </FormControl>
//                 <TextField
//                   label="Weight (e.g. 500ml, 1L)"
//                   fullWidth
//                   name="weight"
//                   value={selectedProduct.weight || ""}
//                   onChange={handleInputChange}
//                 />
//               </Box>

//               {/* Badge, Weight, and Rating */}
//               <Box display="flex" gap={2}>
//                 <TextField
//                   label="Rating"
//                   type="number"
//                   inputProps={{ step: "0.1", min: 0, max: 5 }}
//                   fullWidth
//                   name="rating"
//                   value={selectedProduct.rating || ""}
//                   onChange={handleInputChange}
//                 />
//                 <TextField
//                   label="Reviews"
//                   type="number"
//                   inputProps={{ step: "1", min: 0 }}
//                   fullWidth
//                   name="reviews"
//                   value={selectedProduct.reviews || ""}
//                   onChange={handleInputChange}
//                 />
//               </Box>

//               {/* Description */}
//               <TextField
//                 label="Description"
//                 fullWidth
//                 multiline
//                 rows={3}
//                 name="description"
//                 value={selectedProduct.description || ""}
//                 onChange={handleInputChange}
//               />

//               {/* Prices */}
//               <Box display="flex" gap={2}>
//                 <TextField
//                   label="Regular Price"
//                   fullWidth
//                   name="regularPrice"
//                   type="number"
//                   value={selectedProduct.regularPrice || ""}
//                   onChange={handleInputChange}
//                 />
//                 <TextField
//                   label="Sale Price"
//                   fullWidth
//                   name="salePrice"
//                   type="number"
//                   value={selectedProduct.salePrice || ""}
//                   onChange={handleInputChange}
//                 />
//               </Box>

//               {/* Upload Multiple Images */}
//               <div className="mt-3">
//                 <label className="block font-semibold mb-1">
//                   Product Images
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleImageChange}
//                 />

//                 {/* Image Previews */}
//                 {selectedProduct.images &&
//                   selectedProduct.images.length > 0 && (
//                     <div className="flex flex-wrap gap-3 mt-3">
//                       {selectedProduct.images.map((img, idx) => (
//                         <div
//                           key={idx}
//                           className="relative w-24 h-24 border rounded-md overflow-hidden group"
//                         >
//                           <img
//                             src={
//                               typeof img === "string"
//                                 ? img
//                                 : URL.createObjectURL(img)
//                             }
//                             alt={`Preview ${idx}`}
//                             className="object-cover w-full h-full"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveImage(idx)}
//                             className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
//                           >
//                             ✕
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//               </div>
//             </Box>
//           </DialogContent>

//           <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
//             <Button onClick={handleClose} variant="outlined" color="secondary">
//               Cancel
//             </Button>
//             <Button
//               onClick={
//                 selectedProduct._id ? handleProductUpdate : handleAddProduct
//               }
//               variant="contained"
//               sx={{
//                 background: "linear-gradient(45deg, #1976d2, #0d47a1)",
//                 color: "white",
//                 px: 3,
//               }}
//             >
//               {selectedProduct._id ? "Update Product" : "Add Product"}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       )}

//       {/* NEW/MODIFIED: Snackbar component for displaying success/error messages */}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000} // Auto-hide after 6 seconds
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // Position
//       >
//         <Alert
//           onClose={handleSnackbarClose}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }

// export default SingleProductList;


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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, 
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
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
      category: typeof product.category === 'object' ? product.category._id : product.category || '', 
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
            images: prev.images.filter(img => img !== imgUrl)
        }));
    }
  }

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
    formData.append("ingredients", JSON.stringify(selectedProduct.ingredients || []));
    
    // Existing Images (ONLY for Update)
    if (selectedProduct._id) {
        // Send the list of image URLs that the user kept
        formData.append("existingImages", JSON.stringify(selectedProduct.images || [])); 
    }

    // New Images to Upload
    images.forEach((image) => {
      formData.append("images", image);
    });
    
    return formData;
  }

  // Update product details in modal
  const handleProductUpdate = async () => {
    const formData = prepareFormData();

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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}`,
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
            setSelectedProduct({ 
                // Initialize new product with required default values
                name: '', brand: '', regularPrice: 0, salePrice: 0, 
                description: '', shortDescription: '', sourcingInfo: '', 
                badge: '', weight: '', rating: 4.5, reviews: 0, 
                images: [], features: [], ingredients: []
            });
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
                <strong>Regular Price</strong>
              </TableCell>
              <TableCell>
                <strong>Sale Price</strong>
              </TableCell>
              <TableCell>
                <strong>Badge</strong>
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
                  <TableCell>
                    <Box display="flex" alignItems="center">
                        {product.images && product.images.length > 0 && (
                            <img
                                src={`${product.images[0]}`}
                                alt={product.name}
                                width={40}
                                style={{marginRight: '12px', borderRadius: '4px'}}
                            />
                        )}
                        {product.name}
                    </Box>
                  </TableCell>
                  <TableCell>₹ {product.regularPrice}</TableCell>
                  <TableCell>₹ {product.salePrice || "-"}</TableCell>
                  <TableCell>{product.badge || "-"}</TableCell>
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
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
          <DialogTitle className="font-bold text-lg">
            {selectedProduct._id ? "Edit Product" : "Add New Product"}
          </DialogTitle>

          <DialogContent dividers>
            <Box
              component="form"
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}
            >
              
              {/* === SECTION 1: CORE INFO === */}
              <Typography variant="h6" className="font-bold text-blue-600 border-b pb-1">Core Information</Typography>
              <Box display="flex" gap={2}>
                <TextField
                  label="Product Name"
                  fullWidth
                  name="name"
                  value={selectedProduct.name || ""}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Brand Name" // NEW
                  fullWidth
                  name="brand"
                  value={selectedProduct.brand || ""}
                  onChange={handleInputChange}
                />
              </Box>
              
              {/* Category & Badge */}
              <Box display="flex" gap={2}>
                <FormControl fullWidth>
                  <InputLabel id="badge-label">Badge</InputLabel>
                  <Select
                    labelId="badge-label"
                    id="badge"
                    name="badge"
                    value={selectedProduct.badge || ""}
                    label="Badge"
                    onChange={handleInputChange}
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

              {/* Descriptions & Sourcing */}
              <TextField
                label="Short Description (For Cards/Snippets)" // NEW
                fullWidth
                multiline
                rows={2}
                name="shortDescription"
                value={selectedProduct.shortDescription || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Detailed Description"
                fullWidth
                multiline
                rows={4}
                name="description"
                value={selectedProduct.description || ""}
                onChange={handleInputChange}
              />
              <TextField
                label="Sourcing & Ingredients Info (For Tab)" // NEW
                fullWidth
                multiline
                rows={3}
                name="sourcingInfo"
                value={selectedProduct.sourcingInfo || ""}
                onChange={handleInputChange}
              />

              {/* === SECTION 2: PRICING & METRICS === */}
              <Typography variant="h6" className="font-bold text-blue-600 border-b pb-1 mt-3">Pricing & Metrics</Typography>
              <Box display="flex" gap={2}>
                <TextField
                  label="Regular Price"
                  fullWidth
                  name="regularPrice"
                  type="number"
                  inputProps={{ step: "0.01", min: 0 }}
                  value={selectedProduct.regularPrice || ""}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Sale Price"
                  fullWidth
                  name="salePrice"
                  type="number"
                  inputProps={{ step: "0.01", min: 0 }}
                  value={selectedProduct.salePrice || ""}
                  onChange={handleInputChange}
                />
              </Box>

              <Box display="flex" gap={2}>
                <TextField
                  label="Weight (e.g. 500ml, 1L)"
                  fullWidth
                  name="weight"
                  value={selectedProduct.weight || ""}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Rating"
                  type="number"
                  inputProps={{ step: "0.1", min: 0, max: 5 }}
                  fullWidth
                  name="rating"
                  value={selectedProduct.rating || ""}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Reviews Count"
                  type="number"
                  inputProps={{ step: "1", min: 0 }}
                  fullWidth
                  name="reviews"
                  value={selectedProduct.reviews || ""}
                  onChange={handleInputChange}
                />
              </Box>
              
              {/* === SECTION 3: FEATURES (Why You'll Love It) === */}
              <Typography variant="h6" className="font-bold text-blue-600 border-b pb-1 mt-3">Key Features / Benefits</Typography>
              {selectedProduct.features.map((feature, index) => (
                <Box key={index} display="flex" gap={2} alignItems="center">
                    <TextField
                        label="Feature Text"
                        fullWidth
                        value={feature.text || ""}
                        onChange={(e) => handleArrayChange('features', index, 'text', e.target.value)}
                    />
                    <IconButton 
                        color="error" 
                        onClick={() => handleRemoveArrayItem('features', index)}
                    >
                        <RemoveIcon />
                    </IconButton>
                </Box>
              ))}
              <Button 
                startIcon={<AddIcon />} 
                onClick={() => handleAddArrayItem('features', {text: '', iconName: ''})}
                variant="outlined"
              >
                Add Feature
              </Button>

              {/* === SECTION 4: INGREDIENTS (Spotlight) === */}
              <Typography variant="h6" className="font-bold text-blue-600 border-b pb-1 mt-3">Key Ingredients</Typography>
              {selectedProduct.ingredients.map((ingredient, index) => (
                <Box key={index} display="flex" gap={2} alignItems="center">
                    <TextField
                        label="Ingredient Name"
                        sx={{ flex: 1 }}
                        value={ingredient.name || ""}
                        onChange={(e) => handleArrayChange('ingredients', index, 'name', e.target.value)}
                    />
                    <TextField
                        label="Ingredient Benefit"
                        sx={{ flex: 2 }}
                        value={ingredient.benefit || ""}
                        onChange={(e) => handleArrayChange('ingredients', index, 'benefit', e.target.value)}
                    />
                    <IconButton 
                        color="error" 
                        onClick={() => handleRemoveArrayItem('ingredients', index)}
                    >
                        <RemoveIcon />
                    </IconButton>
                </Box>
              ))}
              <Button 
                startIcon={<AddIcon />} 
                onClick={() => handleAddArrayItem('ingredients', {name: '', benefit: ''})}
                variant="outlined"
              >
                Add Ingredient
              </Button>


              {/* === SECTION 5: IMAGE UPLOAD === */}
              <Typography variant="h6" className="font-bold text-blue-600 border-b pb-1 mt-3">Images</Typography>
              <div className="mt-3">
                <label className="block font-semibold mb-2">
                  Upload New Images (Files)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />

                {/* Existing Image Previews (with delete option) */}
                {selectedProduct._id && selectedProduct.images && selectedProduct.images.length > 0 && (
                  <div className="mt-4">
                      <Typography variant="subtitle1" className="mb-2">Existing Images:</Typography>
                      <div className="flex flex-wrap gap-3">
                      {selectedProduct.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative w-24 h-24 border rounded-md overflow-hidden group"
                          title="Click 'X' to remove this image from the product."
                        >
                          <img
                            src={imgUrl}
                            alt={`Existing Preview ${idx}`}
                            className="object-cover w-full h-full"
                          />
                          <IconButton
                            type="button"
                            size="small"
                            onClick={() => handleRemoveExistingImage(imgUrl)}
                            className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white p-1 text-xs opacity-80 group-hover:opacity-100 transition"
                            sx={{
                                '&:hover': {
                                    bgcolor: 'error.main'
                                }
                            }}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </div>
                      ))}
                      </div>
                  </div>
                )}
                
                {/* New Image Previews */}
                {images.length > 0 && (
                    <div className="mt-4">
                        <Typography variant="subtitle1" className="mb-2">New Images to Upload:</Typography>
                        <div className="flex flex-wrap gap-3">
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                className="w-24 h-24 border rounded-md overflow-hidden"
                            >
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt={`New Preview ${idx}`}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))}
                        </div>
                    </div>
                )}
              </div>
            </Box>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button
              onClick={
                selectedProduct._id ? handleProductUpdate : handleAddProduct
              }
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #ec4899, #db2777)", // Pink gradient
                color: "white",
                px: 3,
              }}
            >
              {selectedProduct._id ? "Update Product" : "Add Product"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar component for displaying success/error messages */}
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