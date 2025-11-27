"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import api from "@/utils/axiosClient";

// UI/MUI Imports
import { motion } from "framer-motion";
import { Rating, Button, Typography, IconButton } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import WbIncandescentOutlinedIcon from "@mui/icons-material/WbIncandescentOutlined";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import Slider from "react-slick";

// Icon Imports
import {
  Star,
  FavoriteBorder,
  ChevronLeft,
  ChevronRight,
  AddShoppingCart as AddShoppingCartIcon,
} from "@mui/icons-material";

// Component Imports
import Header from "@/components/header";
import Footer from "@/components/footer";
import UspsSection from "@/components/uspsSection";
import CartSidebar from "@/components/CartSidebar";

// --- COLOR PALETTE (Required for Theming) ---
const PRIMARY_COLOR = "#731162"; // Your requested color (Deep Blue)
const PRIMARY_HOVER = "#FC6CB4"; // Slightly darker for hover states
const PRIMARY_LIGHT = "#F0A400"; // Lighter shade for borders/rings
// ---------------------------------------------

// --- Default Data (Minimal state for Loading/Error Handling) ---
// This is necessary to prevent runtime errors while the product data is fetched.
const defaultProductState = {
  _id: null,
  name: "Loading Product Details...",
  description: "Fetching detailed information...",
  regularPrice: 0,
  salePrice: 0,
  rating: 0, // Set to 0 to show no rating until loaded
  reviewCount: 0,
  weight: "N/A",
  images: ["https://via.placeholder.com/600x600/ccc/888?text=Loading..."],
  features: [], // Will be empty until loaded
  sourcingInfo: "Sourcing details are loading.",
};

// Framer Motion Variants for subtle animations (Not temporary data)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, duration: 0.5 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// --- Main Component ---
const ProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(defaultProductState);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);

  const dispatch = useDispatch();

  // === Handlers ===
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddToCart = (productToAdd = product) => {
    if (!productToAdd?._id) return;

    const cartItem = {
      id: productToAdd._id,
      name: productToAdd.name,
      price: productToAdd.salePrice,
      quantity: 1,
      image: productToAdd.images?.[0] || defaultProductState.images[0],
    };
    dispatch(addToCart(cartItem));
    setSnackbarOpen(true);
    setCartSidebarOpen(true); // <-- open sidebar here
  };

  const handleBuyNow = () => {
    if (!product?._id) return;

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      image: product.images?.[0] || defaultProductState.images[0],
    };

    dispatch(addToCart(cartItem));
    router.push("/checkout"); // redirect
  };

  // Image Gallery Navigation
  const productImages = product.images || defaultProductState.images;
  const currentImage = productImages[activeIndex] || productImages[0];

  const goToNextImage = () => {
    setActiveIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevImage = () => {
    setActiveIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };
  // ------------------------------------

  useEffect(() => {
    if (!id) return;

    const fetchProductAndRelated = async () => {
      try {
        const productResponse = await api.get(`/api/products/${id}`);
        const currentProduct = {
          ...productResponse.data,
          reviewCount: productResponse.data.reviews?.length || 0,
          rating: productResponse.data.rating || 0,
        };
        setProduct(currentProduct);

        // Now fetch related using the freshly fetched product’s category
        const allProductsResponse = await api.get("/api/products");
        const related = allProductsResponse.data
          .filter((p) => p.category === currentProduct.category && p._id !== id)
          .slice(0, 4);

        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError(
          "Failed to fetch product details. Please try refreshing the page."
        );
        setProduct(defaultProductState);
      }
    };

    fetchProductAndRelated();
  }, [id]); // ✅ only depend on id

  // Slider settings for Related Products (Not temporary data)
  const carouselSettings = {
    dots: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  // Error/Loading checks
  if (error)
    return (
      <div className="text-center py-20 text-red-600 font-bold">{error}</div>
    );
  if (!product._id && product.name === defaultProductState.name)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading Product Details...
      </div>
    );

  // Calculate discount percentage safely
  const regularPrice = product.regularPrice || 0;
  const salePrice = product.salePrice || 0;
  const discount =
    regularPrice > 0
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : 0;

  // =======================================
  // === PREMIUM UI RENDER START ===
  // =======================================
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* SECTION 1: PRODUCT HERO (Image & Info) */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 pb-12">
            {/* === Product Image Gallery (Left Side) === */}
            <motion.div
              // Width set for better balance (1/2 for lg, 5/12 for xl)
              className="w-full lg:w-1/2 xl:w-5/12 flex flex-col lg:flex-row gap-3 items-center lg:items-start lg:sticky lg:top-4 lg:self-start"
              variants={itemVariants}
            >
              {/* === THUMBNAILS CONTAINER (Vertical for Desktop, Horizontal for Mobile) === */}
              <div
                // Reduced gap to 2 for tighter vertical stack
                className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-hidden w-full lg:w-auto order-2 lg:order-1 px-2 lg:px-0 lg:m-1 justify-center scrollbar-hide"
              >
                {productImages.map((img, index) => (
                  <motion.div
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    // Smaller thumbnail size (w-16 h-16) and reduced ring size
                    className={`relative w-16 h-16 p-1 rounded-lg cursor-pointer transition-all duration-300 shadow-sm flex-shrink-0 
                                ${
                                  activeIndex === index
                                    ? "border-2 ring-2 scale-105"
                                    : "border border-gray-200 hover:border-gray-300"
                                }`}
                    style={
                      activeIndex === index
                        ? {
                            borderColor: PRIMARY_COLOR,
                            boxShadow: `0 0 0 2px ${PRIMARY_COLOR}30`,
                          }
                        : {}
                    }
                    // whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={img}
                      alt={`${product.name}-thumb-${index}`}
                      className="h-full w-full object-contain rounded-md bg-white mix-blend-multiply"
                    />
                  </motion.div>
                ))}
              </div>

              {/* === MAIN IMAGE CONTAINER (Main image and arrows) === */}
              <div
                // flex-1 forces the main image to take the remaining space next to the thumbnails
                className="relative w-full aspect-square max-w-md mx-auto lg:mx-0 bg-white p-4 rounded-xl shadow-xl overflow-hidden group order-1 lg:order-2 lg:flex-1 lg:max-w-none"
              >
                {/* Weight badge (Highest z-index for visibility) */}
                {product.weight && (
                  <div className="absolute top-4 right-4 bg-gray-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full z-50 shadow-lg">
                    {product.weight}
                  </div>
                )}

                {/* Image Navigation Buttons: Switched to standard button elements with SVG */}
                {productImages.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={goToPrevImage}
                      // z-50, w-8 h-8 size, hover fade logic for desktop
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white transition duration-300 z-50 w-8 h-8 rounded-full shadow-lg flex items-center justify-center
                                        lg:opacity-0 lg:group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      {/* SVG Chevron Left Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={goToNextImage}
                      // z-50, w-8 h-8 size, hover fade logic for desktop
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white transition duration-300 z-50 w-8 h-8 rounded-full shadow-lg flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      {/* SVG Chevron Right Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}

                <motion.img
                  key={activeIndex}
                  src={currentImage}
                  alt={`${product.name} image ${activeIndex + 1}`}
                  className="object-contain w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-[1.02] mix-blend-multiply"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>

            {/* === Product Info & Actions (Right Side) === */}
            <motion.div
              className="w-full lg:w-1/2 xl:w-7/12 space-y-6"
              variants={itemVariants}
            >
              <div className="space-y-3">
                <p className="text-sm font-medium text-white uppercase bg-[#F0A400] tracking-widest inline-block px-3 py-1 rounded-full">
                  {product.brand || "Brand Name"}
                </p>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-3">
                  <Rating
                    name="product-rating"
                    value={product.rating || 0}
                    precision={0.1}
                    readOnly
                    emptyIcon={
                      <Star style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                    sx={{ color: PRIMARY_COLOR }}
                  />
                  <Typography
                    variant="body2"
                    className="text-gray-600 font-medium"
                  >
                    {product.rating || 0} ({product.reviews || 0} Reviews)
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label="add to wishlist"
                    style={{ color: PRIMARY_COLOR }}
                    className="text-gray-400 hover:opacity-80"
                  >
                    <FavoriteBorder fontSize="small" />
                  </IconButton>
                </div>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{salePrice.toLocaleString("en-IN")}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{regularPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-lg font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Short ShortDescription */}
              <p
                className={`text-lg text-gray-700 leading-relaxed border-l-4 pl-4 py-2 bg-gray-50 rounded-md`}
                style={{ borderColor: PRIMARY_LIGHT }}
              >
                {product.shortDescription ||
                  "A brief summary of the key product benefits."}
              </p>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                variants={itemVariants}
              >
                <Button
                  variant="contained"
                  onClick={() => handleAddToCart(product)}
                  startIcon={<AddShoppingCartIcon />}
                  className="w-full sm:w-1/2"
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    bgcolor: PRIMARY_COLOR,
                    "&:hover": {
                      bgcolor: PRIMARY_HOVER,
                      boxShadow: `0 4px 15px ${PRIMARY_COLOR}40`,
                    },
                    borderRadius: "10px",
                    boxShadow: `0 2px 8px ${PRIMARY_COLOR}30`,
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleBuyNow}
                  className="w-full sm:w-1/2"
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                    "&:hover": {
                      borderColor: PRIMARY_HOVER,
                      bgcolor: `${PRIMARY_COLOR}10`,
                    },
                    borderRadius: "10px",
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Buy Now
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* SECTION 2: KEY FEATURES / USPS */}

          {product.features?.length > 0 && (
            <motion.div className="py-8" variants={itemVariants}>
              <h2 className="text-3xl font-bold text-[#F0A400] mb-6 text-center">
                Key Product Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {product.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start p-4 bg-white rounded-xl shadow-lg border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                    }}
                  >
                    {/* Static MUI Star Icon */}
                    <TaskAltIcon
                      className="text-pink-500 mr-4 mt-1 flex-shrink-0"
                      fontSize="medium"
                    />

                    <p className="text-lg font-medium text-gray-700">
                      {feature.text || "Feature description missing"}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <hr className="my-8 border-gray-200" />

          {/* SECTION 3: TABS (Description & Sourcing) */}
          <motion.div className="py-4" variants={itemVariants}>
            <div className="shadow-lg rounded-xl p-5 w-full bg-white">
              <div className="flex space-x-8 justify-center border-b border-gray-200 mb-6">
                {/* How to Use Tab */}
                <button
                  className={`py-3 px-4 font-bold transition-colors flex items-center ${
                    activeTab === "description"
                      ? "border-b-2"
                      : "text-gray-600 hover:opacity-80"
                  }`}
                  style={{
                    color:
                      activeTab === "description" ? PRIMARY_COLOR : undefined,
                    borderColor:
                      activeTab === "description" ? PRIMARY_COLOR : undefined,
                  }}
                  onClick={() => setActiveTab("description")}
                >
                  <WbIncandescentOutlinedIcon
                    className="mr-2"
                    fontSize="small"
                  />
                  How to Use
                </button>

                {/* Sourcing & Ingredients Tab */}
                <button
                  className={`py-3 px-4 font-bold transition-colors flex items-center ${
                    activeTab === "sourcing"
                      ? "border-b-2"
                      : "text-gray-600 hover:opacity-80"
                  }`}
                  style={{
                    color: activeTab === "sourcing" ? PRIMARY_COLOR : undefined,
                    borderColor:
                      activeTab === "sourcing" ? PRIMARY_COLOR : undefined,
                  }}
                  onClick={() => setActiveTab("sourcing")}
                >
                  <LocalFloristOutlinedIcon className="mr-2" fontSize="small" />
                  Sourcing & Ingredients
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                {activeTab === "description" && (
                  <p className="text-gray-700 leading-relaxed">
                    {product.description ||
                      "No detailed description available."}
                  </p>
                )}
                {activeTab === "sourcing" && (
                  <p className="text-gray-700 leading-relaxed">
                    {product.sourcingInfo ||
                      "No sourcing information available."}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <UspsSection />

          {/* SECTION 4: RELATED PRODUCTS */}
          <motion.div className="py-8" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-[#F0A400] mb-8 text-center">
              You May Also Like
            </h2>
            {relatedProducts.length > 0 ? (
              <Slider {...carouselSettings}>
                {relatedProducts.map((product) => (
                  <div key={product._id} className="p-3">
                    <div className="relative bg-white border rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                      <Link
                        href={`/products/${product._id}`}
                        className="flex-1 flex flex-col"
                      >
                        <div className="flex justify-center items-center p-4">
                          <img
                            src={
                              Array.isArray(product.images)
                                ? product.images[0]
                                : defaultProductState.images[0]
                            }
                            alt={product.name}
                            className="h-48 w-full object-contain mix-blend-multiply"
                          />
                        </div>

                        <div className="px-4 pb-4 flex-1 flex flex-col">
                          <h5 className="text-gray-800 font-semibold text-lg mb-1 line-clamp-1">
                            {product.name}
                          </h5>
                          <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                            {product.description ||
                              "Key benefits of the product..."}
                          </p>

                          <div className="flex items-center text-yellow-400 text-sm mb-2">
                            <Star fontSize="small" />
                            <span className="ml-1">{product.rating || 0}</span>
                            <span className="ml-2 text-gray-500 text-xs">
                              ({product.reviewCount || 0} Reviews)
                            </span>
                          </div>

                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            my={1}
                            mt="auto"
                          >
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: PRIMARY_COLOR }}
                            >
                              ₹{product.salePrice.toLocaleString("en-IN")}
                            </Typography>
                            {product.regularPrice > product.salePrice && (
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ textDecoration: "line-through" }}
                              >
                                ₹{product.regularPrice.toLocaleString("en-IN")}
                              </Typography>
                            )}
                          </Box>
                        </div>
                      </Link>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`w-full text-white py-3 rounded-b-xl font-semibold transition`}
                        style={{
                          backgroundColor: PRIMARY_COLOR,
                          color: "#FFFFFF",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            PRIMARY_HOVER)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            PRIMARY_COLOR)
                        }
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-center p-10 bg-white rounded-xl shadow-lg border border-gray-200">
                <p className="text-gray-500">No related products found yet.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Product added to cart!
        </Alert>
      </Snackbar>
      <CartSidebar
        open={cartSidebarOpen}
        onClose={() => setCartSidebarOpen(false)}
      />
      <Footer />
    </>
  );
};

export default ProductDetail;
