"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  TextField,
  MenuItem,
  Drawer,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { motion } from "framer-motion";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [added, setAdded] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceInput, setPriceInput] = useState({ min: "", max: "" });
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });

  const dispatch = useDispatch();

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`
        );
        setProducts(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Add to Cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      image: Array.isArray(product.images) ? product.images[0] : product.images,
    };
    dispatch(addToCart(cartItem));
    setSnackbarOpen(true);
    setAdded((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(
      () => setAdded((prev) => ({ ...prev, [product._id]: false })),
      2500
    );
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // ✅ Filter logic
  useEffect(() => {
    let updated = [...products];

    // Search
    if (search.trim()) {
      updated = updated.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description &&
            p.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Sort
    if (sort === "low-high") updated.sort((a, b) => a.salePrice - b.salePrice);
    else if (sort === "high-low")
      updated.sort((a, b) => b.salePrice - a.salePrice);
    else if (sort === "new")
      updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Price range
    const min = parseInt(priceRange.min) || 0;
    const max = parseInt(priceRange.max) || Infinity;
    updated = updated.filter((p) => p.salePrice >= min && p.salePrice <= max);

    setFiltered(updated);
  }, [search, sort, priceRange, products]);

  // ✅ Sidebar (Filter Panel)
  const FilterPanel = (
    <Box className="w-72 p-5">
      <div className="flex justify-between items-center mb-3 sm:hidden">
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </div>

      {/* 🔍 Search */}
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        Search
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Divider sx={{ my: 3 }} />

      {/* 🔽 Sort */}
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        Sort by
      </Typography>
      <TextField
        select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        fullWidth
        size="small"
      >
        <MenuItem value="">Default</MenuItem>
        <MenuItem value="low-high">Price: Low to High</MenuItem>
        <MenuItem value="high-low">Price: High to Low</MenuItem>
        <MenuItem value="new">Newest First</MenuItem>
      </TextField>

      <Divider sx={{ my: 3 }} />

      {/* 💰 Min-Max Price Input */}
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        Price Range (₹)
      </Typography>

      <div className="flex items-center gap-3 mb-3">
        <TextField
          label="Min"
          type="number"
          size="small"
          value={priceInput.min}
          onChange={(e) =>
            setPriceInput({ ...priceInput, min: e.target.value })
          }
          inputProps={{ min: 0 }}
          className="w-1/2"
        />
        <TextField
          label="Max"
          type="number"
          size="small"
          value={priceInput.max}
          onChange={(e) =>
            setPriceInput({ ...priceInput, max: e.target.value })
          }
          inputProps={{ min: 0 }}
          className="w-1/2"
        />
      </div>

      <Button
        fullWidth
        variant="contained"
        onClick={() =>
          setPriceRange({
            min: parseInt(priceInput.min) || 0,
            max: parseInt(priceInput.max) || Infinity,
          })
        }
        sx={{
          backgroundColor: "#731162",
          "&:hover": { backgroundColor: "#FC6CB4" },
          textTransform: "none",
          fontWeight: "bold",
        }}
      >
        Apply
      </Button>
    </Box>
  );

  return (
    <>
      <Header />

      {/* 📱 Mobile Filter Toggle */}
      <div className="sm:hidden sticky top-0 z-20 bg-white border-b flex justify-between items-center px-4 py-3 shadow-sm">
        <Typography variant="h6">All Products</Typography>
        <IconButton onClick={() => setDrawerOpen(true)}>
          <FilterListIcon />
        </IconButton>
      </div>

      <div className="flex">
        {/* Sidebar (Desktop) */}
        <aside className="hidden sm:block w-72 border-r min-h-screen bg-white">
          {FilterPanel}
        </aside>

        {/* Drawer (Mobile) */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {FilterPanel}
        </Drawer>

        {/* 🛍️ Product Grid */}
        <main className="flex-1 px-4 sm:px-8 py-8 bg-gray-50 min-h-screen">
          {loading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <Typography variant="h6" color="text.secondary">
                Loading products...
              </Typography>
            </div>
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : filtered.length === 0 ? (
            <Typography align="center" color="text.secondary" className="mt-20">
              No products found.
            </Typography>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border hover:shadow-lg transition-all overflow-hidden group"
                >
                  <Link href={`/products/${product._id}`}>
                    <div className="bg-gray-50 flex justify-center items-center h-56 sm:h-64 p-5 overflow-hidden">
                      <motion.img
                        src={
                          Array.isArray(product.images)
                            ? product.images[0]
                            : product.images
                        }
                        alt={product.name}
                        className="object-contain h-full w-auto group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h5 className="font-semibold text-[#731162] text-lg line-clamp-1">
                        {product.name}
                      </h5>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {product.description || "Premium quality product."}
                      </p>
                      <Box display="flex" alignItems="center" gap={1}>
                        {product.regularPrice &&
                          product.salePrice < product.regularPrice && (
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: "line-through",
                                color: "#999",
                              }}
                            >
                              ₹{product.regularPrice}
                            </Typography>
                          )}
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#C00000" }}
                        >
                          ₹{product.salePrice}
                        </Typography>
                      </Box>
                    </div>
                  </Link>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`w-full flex items-center justify-center gap-2 py-2 font-semibold transition-all duration-300 ${
                      added[product._id]
                        ? "bg-green-600 hover:bg-green-500"
                        : "bg-[#731162] hover:bg-[#FC6CB4]"
                    } text-white`}
                  >
                    {added[product._id] ? (
                      <>
                        <CheckCircleIcon /> <span>ADDED</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCartOutlinedIcon /> <span>ADD TO CART</span>
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={handleSnackbarClose}>
          Product added to cart!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductsPage;
