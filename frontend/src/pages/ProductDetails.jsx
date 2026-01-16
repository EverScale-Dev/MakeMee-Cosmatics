import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  Check,
} from "lucide-react";

import { getProductById, formatPrice, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePageTransition } from "@/hooks/useGSAP";
import { toast } from "sonner";

const ProductDetails = () => {
  usePageTransition();

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = id ? getProductById(id) : null;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <main className="pt-28 pb-20 min-h-screen bg-white text-center">
        <h1 className="text-3xl font-semibold text-black mb-6">
          Product Not Found
        </h1>
        <Link to="/shop">
          <button className="px-6 py-3 bg-[#FC6CB4] text-black rounded-full hover:bg-[#F0A400]">
            Back to Shop
          </button>
        </Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id && p.tags.some((tag) => product.tags.includes(tag))
    )
    .slice(0, 4);

  const tabs = [
    { id: "description", label: "Description", content: product.description },
    {
      id: "ingredients",
      label: "Ingredients",
      content:
        product.ingredients?.join(", ") ||
        "See packaging for full ingredient list.",
    },
    {
      id: "usage",
      label: "How to Use",
      content: product.usage || "Follow instructions on the product packaging.",
    },
  ];

  return (
    <main className="pt-28 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-black/60 hover:text-black mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        {/* Product Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
            {/* Images */}
            <AnimatedSection>
              <div className="aspect-square rounded-3xl overflow-hidden bg-black/5">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-3 mt-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-[#FC6CB4]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </AnimatedSection>

            {/* Details */}
            <AnimatedSection className="space-y-6">
              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#FC6CB4]/20 text-black text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-semibold text-black">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-[#F0A400] text-[#F0A400]"
                          : "text-black/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-black font-medium">{product.rating}</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-black">
                  {formatPrice(product.price)}
                </span>

                {product.originalPrice && (
                  <>
                    <span className="text-lg line-through text-black/40">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="px-2 py-0.5 bg-[#F0A400]/20 text-black text-sm rounded">
                      {Math.round(
                        (1 - product.price / product.originalPrice) * 100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              <p className="text-black/70">{product.shortDescription}</p>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#731162]" />
                <span className="text-[#731162] font-medium">In Stock</span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="font-medium text-black">Quantity</span>
                <div className="flex items-center bg-black/5 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3"
                  >
                    <Minus />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3"
                  >
                    <Plus />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 
                  bg-[#FC6CB4] text-black rounded-full 
                  hover:bg-[#F0A400] transition"
                      >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full sm:flex-1 px-6 py-3 
                    border border-black text-black rounded-full 
                    hover:bg-black/5 transition"
                  >
                    Buy Now
                  </button>
                </div>

                <button onClick={() => toggleWishlist(product)} className="p-3">
                  <Heart
                    className={`w-6 h-6 ${
                      isInWishlist(product.id)
                        ? "fill-[#FC6CB4] text-[#FC6CB4]"
                        : "text-black"
                    }`}
                  />
                </button>
              </div>

              {/* Tabs */}
              <div className="pt-8 border-t border-black/10">
                <div className="flex gap-8 text-sm font-medium">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative pb-2 ${
                        activeTab === tab.id ? "text-black" : "text-black/50"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <span className="absolute left-0 -bottom-[1px] w-full h-[2px] bg-[#FC6CB4]" />
                      )}
                    </button>
                  ))}
                </div>

                <p className="mt-6 text-black/70 max-w-2xl">
                  {tabs.find((t) => t.id === activeTab)?.content}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-center text-3xl font-semibold text-black mb-12">
              You May Also Like
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetails;
