"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BoltIcon from "@mui/icons-material/Bolt";
import Slider from "react-slick";

export const TopSellerList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`
        );
        const topSellerProducts = response.data.filter(product => product.isTopSeller === true);
        setProducts(topSellerProducts);
        // console.log("Top seller product list", topSellerProducts);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "40px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
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

  if (loading) {
    return <p className="text-center text-xl">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-xl text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container py-5 overflow-hidden">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Top Selling Products
      </h1>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product._id} className="p-3">
          <Link sx={{display:"flex", justifyContent:"center"}} href={`/products/${product._id}`} passHref >
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
                image={`${product.images[0]}`}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {[
                    product.weight?.grams && `${product.weight.grams}`,
                    product.weight?.pieces && `${product.weight.pieces}`,
                    product.weight?.serves && ` ${product.weight.serves}`,
                  ]
                    .filter(Boolean)
                    .join(" | ")}
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
                    sx={{ textDecoration: "line-through", fontWeight: "bold" }}
                  >
                    ₹{product.regularPrice}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: "bold", color: "#C00000" }}
                  >
                    ₹{product.salePrice}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "green", fontWeight: "bold" }}
                >
                  <BoltIcon sx={{ color: "yellow" }} />
                  Get Delivered in 2 Hours
                </Typography>
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
  );
};
