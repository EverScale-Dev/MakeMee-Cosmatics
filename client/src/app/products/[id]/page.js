// "use client";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { addToCart } from "@/store/slices/cartSlice";
// import Header from "@/components/header";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import Typography from "@mui/material/Typography";
// import Footer from "@/components/footer";
// import BoltIcon from "@mui/icons-material/Bolt";
// import Box from "@mui/material/Box";
// import Slider from "react-slick";
// import UspsSection from "@/components/whychooseus";
// import api from "@/utils/axiosClient";

// const ProductDetail = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("description");
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0); // 👈 Added for image gallery

//   const dispatch = useDispatch();

//   const handleAddToCart = () => {
//     const cartItem = {
//       id: product._id,
//       name: product.name,
//       price: product.salePrice,
//       quantity: 1,
//       image: product.images[0],
//     };
//     dispatch(addToCart(cartItem));
//     setSnackbarOpen(true);
//   };

//   // Fetch product + related products
//   useEffect(() => {
//     if (id) {
//       api
//         .get(`/products/${id}`)
//         .then((response) => {
//           const currentProduct = response.data;
//           setProduct(currentProduct);

//           return api.get("/products");
//         })
//         .then((allProductsResponse) => {
//           const related = allProductsResponse.data
//             .filter((p) => p.category === product?.category)
//             .filter((p) => p._id !== id)
//             .slice(0, 4);

//           setRelatedProducts(related);
//         })
//         .catch((error) => {
//           console.error("Error fetching product data:", error);
//           setError("Failed to fetch product details.");
//         });
//     }
//   }, [id]);

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   const carouselSettings = {
//     dots: true,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     responsive: [
//       { breakpoint: 1024, settings: { slidesToShow: 3 } },
//       { breakpoint: 768, settings: { slidesToShow: 2 } },
//       { breakpoint: 480, settings: { slidesToShow: 1 } },
//     ],
//   };

//   if (error) return <div className="text-center">{error}</div>;
//   if (!product) return <div className="text-center">No product found.</div>;

//   return (
//     <>
//       <Header />

//       <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10">
//         {/* ✅ UPDATED IMAGE SECTION (Amazon-style) */}
//         <div className="w-full lg:w-1/2 flex flex-col items-center">
//           {/* Main Image */}
//           <div className="relative w-80 h-80 flex justify-center items-center border rounded-lg shadow-md bg-white overflow-hidden">
//             <img
//               src={product.images[activeIndex]}
//               alt={`${product.name}-${activeIndex}`}
//               className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
//             />

//             {/* Weight badge */}
//             {product.weight && (
//               <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
//                 {product.weight}
//               </div>
//             )}

//             {product.images.length > 1 && (
//               <>
//                 <button
//                   onClick={() =>
//                     setActiveIndex((prev) =>
//                       prev === 0 ? product.images.length - 1 : prev - 1
//                     )
//                   }
//                   className="absolute left-2 bg-gray-800/60 text-white rounded-full p-2 hover:bg-gray-900 transition"
//                 >
//                   ‹
//                 </button>
//                 <button
//                   onClick={() =>
//                     setActiveIndex((prev) =>
//                       prev === product.images.length - 1 ? 0 : prev + 1
//                     )
//                   }
//                   className="absolute right-2 bg-gray-800/60 text-white rounded-full p-2 hover:bg-gray-900 transition"
//                 >
//                   ›
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Thumbnails */}
//           <div className="flex gap-3 mt-4 overflow-x-auto px-2 justify-center scrollbar-hide">
//             {product.images.map((img, index) => (
//               <div
//                 key={index}
//                 onClick={() => setActiveIndex(index)}
//                 className={`border-2 rounded-md cursor-pointer transition-transform duration-200 ${
//                   activeIndex === index
//                     ? "border-blue-600 scale-105"
//                     : "border-gray-300 hover:border-blue-400"
//                 }`}
//               >
//                 <img
//                   src={img}
//                   alt={`${product.name}-thumb-${index}`}
//                   className="h-16 w-16 object-contain rounded-md"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Product Details */}
//         <div className="w-full lg:w-3/5">
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
//             <p className="text-gray-700 mb-4">{product.description}</p>
//             <Typography
//               variant="body2"
//               sx={{ color: "green", fontWeight: "bold", mb: "4px" }}
//             >
//               <BoltIcon sx={{ color: "yellow" }} /> Get Delivered in 2 Hours
//             </Typography>

//             <div className="mb-4 flex items-center">
//               <span className="text-xl text-gray-500 line-through mr-2">
//                 ₹{product.regularPrice}
//               </span>
//               <span className="text-2xl font-semibold text-red-600">
//                 ₹{product.salePrice}
//               </span>
//             </div>

//             <button
//               className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-400 hover:to-blue-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
//               onClick={handleAddToCart}
//             >
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Tabs Section */}
//       <div className="container my-4 flex justify-center w-9/12 mx-auto">
//         <div className="shadow-lg rounded-lg p-5 w-full">
//           <div className="flex space-x-4 justify-center">
//             <button
//               className={`${
//                 activeTab === "description"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-600"
//               } py-2 px-4 font-semibold`}
//               onClick={() => setActiveTab("description")}
//             >
//               Description
//             </button>
//             <button
//               className={`${
//                 activeTab === "sourcing"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-600"
//               } py-2 px-4 font-semibold`}
//               onClick={() => setActiveTab("sourcing")}
//             >
//               Sourcing
//             </button>
//           </div>

//           <div className="mt-6">
//             {activeTab === "description" && (
//               <p className="text-gray-700">
//                 {product.description || "No description available."}
//               </p>
//             )}
//             {activeTab === "sourcing" && (
//               <p className="text-gray-700">
//                 {product.sourcingInfo || "No sourcing information available."}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       <UspsSection />

//       {/* Related Products Section */}
//       <div className="container p-6 mx-auto">
//         <Slider {...carouselSettings}>
//           {relatedProducts.map((product) => (
//             <div key={product._id} className="p-3">
//               <div className="relative bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
//                 <Link
//                   href={`/products/${product._id}`}
//                   className="flex-1 flex flex-col"
//                 >
//                   <div className="flex justify-center items-center p-4">
//                     <img
//                       src={
//                         Array.isArray(product.images)
//                           ? product.images[0]
//                           : product.images
//                       }
//                       alt={product.name}
//                       className="h-60 w-60 object-contain"
//                     />
//                   </div>

//                   <div className="px-4 pb-4 flex-1 flex flex-col">
//                     <h5 className="text-gray-800 font-semibold text-lg mb-1">
//                       {product.name}
//                     </h5>
//                     <p className="text-gray-500 text-base mb-2 line-clamp-2">
//                       {product.description || "Key benefits of the product..."}
//                     </p>

//                     <div className="flex items-center text-yellow-400 text-sm mb-2">
//                       <span>★</span>
//                       <span className="ml-1">{product.rating || 4.5}</span>
//                       <span className="ml-2 text-gray-500 text-xs">
//                         ({product.reviews || 10} Reviews)
//                       </span>
//                     </div>

//                     <Box display="flex" alignItems="center" gap={1} my={1}>
//                       {product.regularPrice &&
//                         product.salePrice < product.regularPrice && (
//                           <Typography
//                             variant="body1"
//                             color="text.secondary"
//                             sx={{
//                               textDecoration: "line-through",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             ₹{product.regularPrice}
//                           </Typography>
//                         )}
//                       <Typography
//                         variant="h6"
//                         sx={{ fontWeight: "bold", color: "#C00000" }}
//                       >
//                         ₹{product.salePrice}
//                       </Typography>
//                       {product.regularPrice &&
//                         product.salePrice < product.regularPrice && (
//                           <Typography
//                             variant="caption"
//                             sx={{
//                               fontWeight: "bold",
//                               color: "green",
//                               ml: 1,
//                             }}
//                           >
//                             {Math.round(
//                               ((product.regularPrice - product.salePrice) /
//                                 product.regularPrice) *
//                                 100
//                             )}
//                             % off
//                           </Typography>
//                         )}
//                     </Box>
//                   </div>
//                 </Link>

//                 <button
//                   onClick={(e) => handleAddToCart(product, e)}
//                   className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-b-lg font-semibold transition"
//                 >
//                   ADD TO CART
//                 </button>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       </div>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleSnackbarClose}
//           severity="success"
//           sx={{ width: "100%" }}
//         >
//           Product added to cart!
//         </Alert>
//       </Snackbar>

//       <Footer />
//     </>
//   );
// };

// export default ProductDetail;

"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import UspsSection from "@/components/whychooseus";

// --- COLOR PALETTE (Required for Theming) ---
const PRIMARY_COLOR = "#284B76"; // Your requested color (Deep Blue)
const PRIMARY_HOVER = "#1E3B5C"; // Slightly darker for hover states
const PRIMARY_LIGHT = "#3E669B"; // Lighter shade for borders/rings
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

  const [product, setProduct] = useState(defaultProductState);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

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
  };

  const handleBuyNow = () => {
    console.log(`Initiating Buy Now for ${product.name}.`);
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

  // === API Logic (CLEANED to remove static fallback values in the response object) ===
  useEffect(() => {
    if (id) {
      api
        .get(`/products/${id}`)
        .then((response) => {
          // Use a clean product object based purely on API response
          const currentProduct = {
            ...response.data,
            reviewCount: response.data.reviews?.length || 0, // Fallback to 0, not static '520'
            rating: response.data.rating || 0, // Fallback to 0, not static '4.9'
          };
          setProduct(currentProduct);

          return api.get("/products");
        })
        .then((allProductsResponse) => {
          // Filter and slice related products
          const related = allProductsResponse.data
            .filter((p) => p.category === product?.category && p._id !== id)
            .slice(0, 4);

          setRelatedProducts(related);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
          setError(
            "Failed to fetch product details. Please try refreshing the page."
          );
          setProduct(defaultProductState);
        });
    }
  }, [id, product?.category]); // dependency array is correct

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
                                ${activeIndex === index
                                    ? 'border-2 ring-2 scale-105' 
                                    : 'border border-gray-200 hover:border-gray-300'
                                }`}
                            style={activeIndex === index ? {
                                borderColor: PRIMARY_COLOR,
                                boxShadow: `0 0 0 2px ${PRIMARY_COLOR}30`
                            } : {}}
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Next Button */}
                            <button
                                onClick={goToNextImage}
                                // z-50, w-8 h-8 size, hover fade logic for desktop
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white transition duration-300 z-50 w-8 h-8 rounded-full shadow-lg flex items-center justify-center
                                        lg:opacity-0 lg:group-hover:opacity-100"
                                aria-label="Next image"
                            >
                                {/* SVG Chevron Right Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
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
                        // FIX: Correctly applying the background color and ensuring text is white (This was the main fix)
                        className={`w-full text-white py-3 rounded-b-xl font-semibold transition`}
                        style={{
                          backgroundColor: PRIMARY_COLOR,
                          color: "#FFFFFF",
                        }}
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

      <Footer />
    </>
  );
};

export default ProductDetail;
