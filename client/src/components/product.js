// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";

// export const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`
//         );
//         setProducts(response.data);
//       } catch (error) {
//         setError("Failed to fetch products.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <h2 className="text-2xl">Loading...</h2>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center">
//         <h2 className="text-2xl text-red-500">{error}</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="container grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center p-6">
//       {products.map((product) => (
//         <Link key={product._id} href={`/products/${product._id}`} passHref>
//           <div className="max-w-sm mx-auto mb-5 p-4 shadow-lg rounded-lg transition-transform transform hover:scale-105 bg-white">
//             <div className="flex justify-center mb-4">
//               <img
//                 src={Array.isArray(product.images) ? product.images[0] : product.images}
//                 alt={product.name}
//                 className="h-40 w-40 object-cover rounded-md"
//               />
//             </div>
//             <div className="text-center">
//               <h5 className="text-lg font-bold text-gray-800">
//                 {product.name}
//               </h5>
//               <p className="text-gray-600 mt-1">₹{product.salePrice}</p>
//             </div>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// };


"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Box, Typography, Snackbar, Alert, IconButton } from "@mui/material"; // Added IconButton
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";

// 1. Import Slider and icons
import Slider from "react-slick";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// --- Custom Arrow Components ---
// These components allow you to use Material UI icons for navigation

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <IconButton
      className={className}
      style={{ ...style, display: "block", right: "-8px", zIndex: 1, color: '#1e3a8a' }}
      onClick={onClick}
    >
      <ArrowForwardIosIcon />
    </IconButton>
  );
}

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <IconButton
      className={className}
      style={{ ...style, display: "block", left: "-8px", zIndex: 1, color: '#1e3a8a' }}
      onClick={onClick}
    >
      <ArrowBackIosIcon />
    </IconButton>
  );
}

// ---------------------------------

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`
        );
        setProducts(response.data);
      } catch (error) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // Prevent navigation on button click

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      image: Array.isArray(product.images)
        ? product.images[0]
        : product.images,
    };

    dispatch(addToCart(cartItem));
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // 2. Slider Settings
  const settings = {
    dots: true,
    infinite: false, // Prevents infinite loop, good for a product list end
    speed: 500,
    slidesToShow: 4, // Default desktop view
    slidesToScroll: 1,
    nextArrow: <NextArrow />, // Use custom arrows
    prevArrow: <PrevArrow />,
    responsive: [ // Responsive settings from your old grid
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480, // Extra small
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl font-semibold">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl text-red-500 font-semibold">{error}</h2>
      </div>
    );
  }

  return (
    <>
      {/* 3. Replace the grid with the Slider component */}
      <div className="container p-6 mx-auto">
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product._id} className="p-3"> {/* Add padding for spacing */}
              <div className="relative bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
                {/* Clickable Product Area */}
                <Link
                  href={`/products/${product._id}`}
                  className="flex-1 flex flex-col"
                >
                  {/* Badge + Weight */}
                  {(product.badge || product.weight) && (
                    <div className="absolute top-2 left-2 flex flex-col space-y-1">
                      {product.badge && (
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${
                            product.badge === "NEW LAUNCH"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}
                      {product.weight && (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-800 text-white">
                          {product.weight}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="flex justify-center items-center p-4">
                    <img
                      src={
                        Array.isArray(product.images)
                          ? product.images[0]
                          : product.images
                      }
                      alt={product.name}
                      className="h-60 w-60 object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="px-4 pb-4 flex-1 flex flex-col">
                    <h5 className="text-gray-800 font-semibold text-lg mb-1">
                      {product.name}
                    </h5>
                    <p className="text-gray-500 text-base mb-2 line-clamp-2">
                      {product.description || "Key benefits of the product..."}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center text-yellow-400 text-sm mb-2">
                      <span>★</span>
                      <span className="ml-1">{product.rating || 4.5}</span>
                      <span className="ml-2 text-gray-500 text-xs">
                        ({product.reviews || 10} Reviews)
                      </span>
                    </div>

                    {/* Price (MUI version) */}
                    <Box display="flex" alignItems="center" gap={1} my={1}>
                      {product.regularPrice &&
                        product.salePrice < product.regularPrice && (
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                              textDecoration: "line-through",
                              fontWeight: "bold",
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
                      {product.regularPrice &&
                        product.salePrice < product.regularPrice && (
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold", color: "green", ml: 1 }}
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

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-b-lg font-semibold transition"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Snackbar for cart confirmation */}
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
    </>
  );
};