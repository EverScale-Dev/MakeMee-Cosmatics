"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Box, Typography, Snackbar, Alert, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import Slider from "react-slick";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

// ✅ Custom Arrows (updated brand colors)
const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 bg-white text-[#731162] shadow-lg hover:bg-[#731162] hover:text-white transition-all duration-300 z-10"
    size="large"
  >
    <ArrowForwardIosRoundedIcon />
  </IconButton>
);

const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 bg-white text-[#731162] shadow-lg hover:bg-[#731162] hover:text-white transition-all duration-300 z-10"
    size="large"
  >
    <ArrowBackIosNewRoundedIcon />
  </IconButton>
);

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`);
        setProducts(res.data);
      } catch {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

const settings = {
  dots: products.length > 4, // ✅ show dots only if more than 4 products
  arrows: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  appendDots: (dots) => (
    <div style={{ marginTop: "25px" }}>
      <ul style={{ margin: "0px" }}>{dots}</ul>
    </div>
  ),
  customPaging: () => (
    <div
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "#731162",
      }}
    ></div>
  ),
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 3 } },
    { breakpoint: 1024, settings: { slidesToShow: 2.5 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1.3 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};


  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl font-semibold text-[#731162]">Loading...</h2>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl text-[#FC6CB4] font-semibold">{error}</h2>
      </div>
    );

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 relative">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F0A400] mb-6 text-center">
          Featured Products
        </h2>
        <div className="relative">
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product._id} className="px-3">
                <div className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
                  
                  {/* ✅ Badge & Weight Section */}
                  {(product.badge || product.weight) && (
                    <div className="absolute top-3 right-3 z-10 flex flex-col space-y-1 items-end">
                      {product.badge && (
                        <span
                          className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full shadow-md ${
                            product.badge === "NEW LAUNCH"
                              ? "bg-[#F0A400] text-white"
                              : "bg-[#731162] text-white"
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* ✅ Product Click Area */}
                  <Link href={`/products/${product._id}`} className="flex-1 flex flex-col">
                    {/* Product Image */}
                    <div className="flex justify-center items-center bg-[#FFF0F8] p-2 h-56 sm:h-64">
                      <img
                        src={
                          Array.isArray(product.images)
                            ? product.images[0]
                            : product.images
                        }
                        alt={product.name}
                        className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="px-4 pb-4 pt-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="text-[#731162] font-semibold text-lg sm:text-xl mb-1 line-clamp-1">
                          {product.name}
                        </h5>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                          {product.description || "High-quality product with great benefits."}
                        </p>

                        <div className="flex items-center text-[#F0A400] text-sm mb-2">
                          <span>★</span>
                          <span className="ml-1">{product.rating || 4.5}</span>
                          <span className="ml-2 text-gray-500 text-xs">
                            ({product.reviews || 10} Reviews)
                          </span>
                        </div>
                      </div>

                      {/* ✅ Price Section */}
                      <Box display="flex" alignItems="center" gap={1} my={1}>
                        {product.regularPrice &&
                          product.salePrice < product.regularPrice && (
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{
                                textDecoration: "line-through",
                                fontWeight: "500",
                                fontSize: "0.9rem",
                              }}
                            >
                              ₹{product.regularPrice}
                            </Typography>
                          )}
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#731162" }}
                        >
                          ₹{product.salePrice}
                        </Typography>
                        {product.regularPrice &&
                          product.salePrice < product.regularPrice && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: "bold",
                                color: "#F0A400",
                                ml: 1,
                              }}
                            >
                              {Math.round(
                                ((product.regularPrice - product.salePrice) /
                                  product.regularPrice) *
                                  100
                              )}
                              % off
                            </Typography>
                          )}
                      </Box>
                    </div>
                  </Link>

                  {/* ✅ Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full flex items-center justify-center gap-2 bg-[#731162] hover:bg-[#FC6CB4] text-white py-2 sm:py-3 rounded-b-2xl font-semibold transition-all duration-300"
                  >
                    <ShoppingCartOutlinedIcon className="text-white text-lg sm:text-xl" />
                    <span>ADD TO CART</span>
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: "100%",
            backgroundColor: "#FC6CB4",
            color: "#FFFFFF",
            fontWeight: "bold",
          }}
        >
          Product added to cart!
        </Alert>
      </Snackbar>
    </>
  );
};
