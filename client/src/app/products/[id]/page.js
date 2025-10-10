"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import Header from "@/components/header";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Footer from "@/components/footer";
import BoltIcon from "@mui/icons-material/Bolt";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Slider from "react-slick";
import UspsSection from "@/components/whychooseus";
import api from "@/utils/axiosClient";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const dispatch = useDispatch();
  const handleAddToCart = () => {
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      image: product.images[0],
    };

    dispatch(addToCart(cartItem));
    setSnackbarOpen(true);
  };

  // =============== START: UPDATED CODE ===============
  useEffect(() => {
    if (id) {
      // 1. Fetch the single product being viewed
      api.get(`/products/${id}`)
        .then((response) => {
          const currentProduct = response.data;
          setProduct(currentProduct);

          // 2. Fetch all products to find related ones
          return api.get("/products");
        })
        .then((allProductsResponse) => {
          const related = allProductsResponse.data
            .filter((p) => p.category === product?.category)
            .filter((p) => p._id !== id)
            .slice(0, 4);

          setRelatedProducts(related);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
          setError("Failed to fetch product details.");
        });
    }
  }, [id]);
  // =============== END: UPDATED CODE ===============


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Carousel settings for related products
  const carouselSettings = {
    dots: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center">{error}</div>;
  if (!product) return <div className="text-center">No product found.</div>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <img
            src={`${product.images[0]}`} // Assuming the first image is the one you want to show
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg object-cover transition-transform duration-300 transform hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-3/5">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <Typography
              variant="body2"
              sx={{ color: "green", fontWeight: "bold", mb: "4px" }}
            >
              {" "}
              <BoltIcon sx={{ color: "yellow" }} />
              Get Delivered in 2 Hours
            </Typography>

            <div className="mb-4 flex items-center">
              <span className="text-xl text-gray-500 line-through mr-2">
                ₹{product.regularPrice}
              </span>
              <span className="text-2xl font-semibold text-red-600">
                ₹{product.salePrice}
              </span>
            </div>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-400 hover:to-blue-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="container my-4 flex justify-center w-9/12 mx-auto">
        <div className="shadow-lg rounded-lg p-5 w-full">
          <div className="flex space-x-4 justify-center">
            <button
              className={`${
                activeTab === "description"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              } py-2 px-4 font-semibold`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`${
                activeTab === "sourcing"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              } py-2 px-4 font-semibold`}
              onClick={() => setActiveTab("sourcing")}
            >
              Sourcing
            </button>
          </div>

          <div className="mt-6">
            {activeTab === "description" && (
              <p className="text-gray-700">
                {product.description || "No description available."}
              </p>
            )}
            {activeTab === "sourcing" && (
              <p className="text-gray-700">
                {product.sourcingInfo || "No sourcing information available."}
              </p>
            )}
          </div>
        </div>
      </div>

      <UspsSection />

      {/* Related Products Section */}
      <div className="container my-8 overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Related Products
        </h1>
        <Slider {...carouselSettings}>
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct._id} className="p-3">
              <Link
                sx={{ display: "flex", justifyContent: "center" }}
                href={`/products/${relatedProduct._id}`}
                passHref
              >
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    boxShadow: 3,
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${relatedProduct.images[0]}`}
                    alt={relatedProduct.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {relatedProduct.name}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={1}
                      my={1}
                    >
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          textDecoration: "line-through",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{relatedProduct.regularPrice}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: "bold", color: "#C00000" }}
                      >
                        ₹{relatedProduct.salePrice}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      sx={{
                        marginTop: "15px",
                        color: "white",
                        background:
                          "linear-gradient(45deg, #D32F2F 30%, #C00000 90%)",
                        borderRadius: 25,
                        boxShadow: "0 3px 5px 2px rgba(192, 0, 0, .3)",
                        padding: "10px 20px",
                        fontWeight: "bold",
                        transition: "0.3s ease",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #B71C1C 30%, #8B0000 90%)",
                          transform: "scale(1.05)",
                          boxShadow: "0 5px 15px 2px rgba(128, 0, 0, .4)",
                        },
                      }}
                    >
                      Add To Cart
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </Slider>
      </div>

      {/* Snackbar for product added to cart */}
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