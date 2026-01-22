
import faceserum1 from "../assets/product/face_serum/1.png";
import faceserum2 from "../assets/product/face_serum/2.png";
import faceserum3 from "../assets/product/face_serum/3.png";

import moisturizer1 from "../assets/product/moisturizer/7.png";
import moisturizer2 from "../assets/product/moisturizer/8.png";
import moisturizer3 from "../assets/product/moisturizer/9.png";

import facewash1 from "../assets/product/face_wash/4.png";
import facewash2 from "../assets/product/face_wash/5.png";
import facewash3 from "../assets/product/face_wash/6.png";

import antiaging1 from "../assets/product/antiagingserum/10.png";
import antiaging2 from "../assets/product/antiagingserum/11.png";
import antiaging3 from "../assets/product/antiagingserum/12.png";



export const products = [
  {
    id: "1",
    name: "face serum",
    shortDescription: "Brightening serum with Vitamin C & Hyaluronic Acid",
    category: "Serums",
    images: [faceserum1, faceserum2, faceserum3],
    rating: 4.8,
    reviews: 234,
    inStock: true,
    tags: ["bestseller", "natural"],
    ingredients: ["Vitamin C", "Hyaluronic Acid", "Niacinamide", "Rose Water"],
    usage: "Apply 2-3 drops on cleansed face morning and evening.",

    sizes: [
      { ml: 15, originalPrice: 1599, sellingPrice: 1299 },
      { ml: 30, originalPrice: 2999, sellingPrice: 2499 },
      { ml: 50, originalPrice: 4499, sellingPrice: 3699 }
    ]
  },

  {
    id: "4",
    name: "face wash",
    shortDescription: "Nourishing lip treatment with rose hip oil",
    category: "Lip Care",
    images: [facewash3, facewash2, facewash3],
    rating: 4.6,
    reviews: 156,
    inStock: true,
    tags: ["trending", "bestseller"],
    ingredients: ["Rose Hip Oil", "Vitamin E", "Beeswax", "Honey"],
    usage: "Apply generously throughout the day and before bed.",

    sizes: [
      { ml: 5, originalPrice: 699, sellingPrice: 499 },
      { ml: 10, originalPrice: 999, sellingPrice: 799 },
      { ml: 15, originalPrice: 1299, sellingPrice: 1099 }
    ]
  },

  {
    id: "5",
    name: "moisturizer",
    shortDescription: "Luxurious blend of 9 botanical oils",
    category: "Face Oils",
    images: [moisturizer2, moisturizer1, moisturizer3],
    rating: 4.9,
    reviews: 98,
    inStock: true,
    tags: ["luxury", "bestseller"],
    ingredients: ["Argan Oil", "Marula Oil", "Rosehip Oil", "Squalane"],
    usage: "Warm 3-4 drops between palms and press onto face.",

    sizes: [
      { ml: 15, originalPrice: 2299, sellingPrice: 1899 },
      { ml: 30, originalPrice: 3999, sellingPrice: 3299 },
      { ml: 50, originalPrice: 5899, sellingPrice: 4899 }
    ]
  },

  {
    id: "7",
    name: "AntiAging serum",
    shortDescription: "Depuffing eye cream with cooling effect",
    category: "Eye Care",
    images: [antiaging3, antiaging2, antiaging1],
    rating: 4.5,
    reviews: 143,
    inStock: true,
    tags: ["eye care", "bestseller"],
    ingredients: ["Caffeine", "Retinol", "Peptides", "Cucumber Extract"],
    usage: "Gently pat around the eye area morning and evening.",

    sizes: [
      { ml: 10, originalPrice: 1099, sellingPrice: 899 },
      { ml: 20, originalPrice: 1599, sellingPrice: 1299 },
      { ml: 30, originalPrice: 2199, sellingPrice: 1799 }
    ]
  }
];




export const categories = [
  "All",
  "Serums",
  "Moisturizers",
  "Cleansers",
  "Lip Care",
  "Face Oils",
  "Masks",
  "Eye Care",
  "Body Care",
];

/* -------------------- HELPERS -------------------- */
export const getProductById = (id) => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (category) => {
  if (category === "All") return products;
  return products.filter(
    (product) => product.category === category
  );
};

export const formatPrice = (price) => {
  // Handle NaN, undefined, null
  const safePrice = Number(price) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(safePrice);
};

export const getFeaturedProducts = () => {
  return products
    .filter((product) =>
      product.tags.includes("bestseller")
    )
    .slice(0, 4);
};
