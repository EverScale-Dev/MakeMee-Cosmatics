import React, { useState, useEffect } from "react";
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

import { productService } from "@/services";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePageTransition } from "@/hooks/useGSAP";
import { toast } from "sonner";
import { optimizeImage, getThumbnail } from "@/utils/cloudinaryUrl";
import { trackEvent } from "@/utils/metaPixel";

// Transform backend product to expected format
const transformBackendProduct = (p) => {
  // Check if product has actual size variants
  const hasSizes = p.sizes && p.sizes.length > 0;

  return {
    ...p,
    id: p._id || p.id,
    // Keep sizes as-is (don't create synthetic sizes for simple products)
    sizes: hasSizes ? p.sizes : [],
    // For products without sizes, use root prices
    regularPrice: p.regularPrice || 0,
    salePrice: p.salePrice || p.regularPrice || 0,
    images: p.images || ["/placeholder.png"],
    rating: p.rating || 4.5,
    shortDescription: p.description || p.shortDescription || "",
  };
};

const ProductDetails = () => {
  usePageTransition();

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedSize, setSelectedSize] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    message: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await productService.getById(id);
        const transformed = transformBackendProduct(data);
        setProduct(transformed);
        // Only set selectedSize if product has size variants
        if (transformed.sizes && transformed.sizes.length > 0) {
          setSelectedSize(transformed.sizes[0]);
        } else {
          // For products without sizes, selectedSize remains null
          setSelectedSize(null);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch reviews when product is loaded
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.id && !product?._id) return;
      const productId = product._id || product.id;

      setReviewsLoading(true);
      try {
        const data = await productService.getReviews(productId);
        setReviews(data.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (product) {
      fetchReviews();
    }
  }, [product]);

  // Submit review handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmittingReview(true);
    try {
      const productId = product._id || product.id;
      await productService.submitReview({
        productId,
        name: reviewForm.name,
        rating: reviewForm.rating,
        message: reviewForm.message,
      });
      toast.success("Review submitted! It will appear after admin approval.");
      setReviewForm({ name: "", rating: 5, message: "" });
      setShowReviewForm(false);
    } catch (err) {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="pt-28 pb-20 min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#731162]"></div>
      </main>
    );
  }

  if (!product || error) {
    return (
      <main className="pt-28 pb-20 min-h-screen bg-white text-center">
        <h1 className="text-3xl font-semibold mb-6">Product Not Found</h1>
        <Link to="/shop">
          <button className="px-6 py-3 bg-[#FC6CB4] rounded-full">
            Back to Shop
          </button>
        </Link>
      </main>
    );
  }

  // Check if product has size variants
  const hasSizes = product.sizes && product.sizes.length > 0;

  // Get prices: from selectedSize if available, otherwise from root product prices
  const sellingPrice = selectedSize?.sellingPrice || product.salePrice || product.regularPrice || 0;
  const originalPrice = selectedSize?.originalPrice || product.regularPrice || product.salePrice || 0;

  const totalSellingPrice = sellingPrice * quantity;
  const totalOriginalPrice = originalPrice * quantity;

  const handleAddToCart = () => {
    // For products without sizes, don't pass selectedSize
    const cartItem = {
      ...product,
      quantity,
    };
    if (selectedSize) {
      cartItem.selectedSize = selectedSize;
    }
    addToCart(cartItem);

    trackEvent("AddToCart", {
      content_ids: [product._id || product.id],
      content_name: product.name,
      content_type: "product",
      value: sellingPrice * quantity,
      currency: "INR",
    });

    // Show appropriate toast message
    const sizeInfo = selectedSize ? ` (${selectedSize.ml} ${selectedSize.unit || "ml"})` : "";
    toast.success(`${quantity} × ${product.name}${sizeInfo} added to cart`);
  };

  const handleBuyNow = () => {
    trackEvent("InitiateCheckout", {
      content_ids: [product._id || product.id],
      content_name: product.name,
      content_type: "product",
      value: sellingPrice * quantity,
      currency: "INR",
      num_items: quantity,
    });
    handleAddToCart();
    navigate("/cart");
  };

  // Related products - will be empty until we fetch from API
  const relatedProducts = [];

  // Format ingredients for display
  const formatIngredients = () => {
    if (!product.ingredients || product.ingredients.length === 0) return null;
    // Check if ingredients is array of objects or array of strings
    if (typeof product.ingredients[0] === "object") {
      return product.ingredients
        .map((ing) => `${ing.name}: ${ing.benefit}`)
        .join("\n\n");
    }
    return product.ingredients.join(", ");
  };

  const tabs = [
    {
      id: "description",
      label: "Description",
      content: product.shortDescription || product.description,
    },
    {
      id: "usage",
      label: "How to Use",
      content: product.howToUse || product.usage,
    },
    {
      id: "sourcing",
      label: "Ingredients & Sourcing Info",
      content: product.sourcingInfo,
    },
  ];

  return (
    <main className="pt-28 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-black/60 mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Images */}
            <AnimatedSection>
              <div className="aspect-square rounded-3xl overflow-hidden bg-black/5">
                <img
                  src={optimizeImage(product.images[selectedImage], {
                    width: 800,
                  })}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
                      selectedImage === i
                        ? "border-[#FC6CB4]"
                        : "border-transparent opacity-60"
                    }`}
                  >
                    <img
                      src={getThumbnail(img, 80)}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </AnimatedSection>

            {/* Details */}
            <AnimatedSection className="space-y-6">
              <h1 className="text-4xl font-semibold">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
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
                <span className="font-medium">{product.rating}</span>
              </div>

              {/* Size Selector - Only show if product has size variants */}
              {hasSizes && (
                <div>
                  <p className="font-medium mb-2">Select Size</p>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => {
                      const isOutOfStock =
                        size.inStock === false ||
                        (size.stock !== undefined && size.stock <= 0);
                      return (
                        <button
                          key={`${size.ml}-${size.unit || "ml"}`}
                          onClick={() => {
                            if (!isOutOfStock) {
                              setSelectedSize(size);
                              setQuantity(1);
                            }
                          }}
                          disabled={isOutOfStock}
                          className={`px-4 py-2 rounded-full border relative ${
                            isOutOfStock
                              ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                              : selectedSize?.ml === size.ml
                                ? "border-[#FC6CB4] bg-[#FC6CB4]/20"
                                : "border-black/20"
                          }`}
                        >
                          {size.ml} {size.unit || "ml"}
                          {isOutOfStock && (
                            <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 text-white px-1 rounded">
                              Out
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Weight display for products without sizes */}
              {!hasSizes && product.weight && (
                <p className="text-gray-600">{product.weight}</p>
              )}

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold">
                  ₹{totalSellingPrice}
                </span>

                {originalPrice > sellingPrice && (
                  <>
                    <span className="text-lg line-through text-black/40">
                      ₹{totalOriginalPrice}
                    </span>

                    <span className="text-sm bg-[#F0A400]/20 px-2 rounded">
                      {Math.round((1 - sellingPrice / originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="bg-[#FDE6F1] rounded-2xl p-4">
                  <h3 className="font-semibold text-[#731162] mb-3">
                    Why You'll Love It
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-[#FC6CB4] mt-0.5 flex-shrink-0" />
                        <span>{feature.text || feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-semibold text-[#731162] mb-3">
                    Key Ingredients
                  </h3>
                  <div className="space-y-2">
                    {product.ingredients.map((ing, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium">{ing.name || ing}</span>
                        {ing.benefit && (
                          <span className="text-gray-600">
                            {" "}
                            — {ing.benefit}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              {(() => {
                const isOutOfStock =
                  selectedSize?.inStock === false ||
                  (selectedSize?.stock !== undefined &&
                    selectedSize?.stock <= 0);
                const maxQty =
                  selectedSize?.stock > 0 ? selectedSize.stock : 10;
                return (
                  !isOutOfStock && (
                    <div className="flex items-center gap-4">
                      <span className="font-medium">Quantity</span>
                      <div className="flex items-center bg-black/5 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-3"
                        >
                          <Minus />
                        </button>
                        <span className="w-12 text-center">{quantity}</span>
                        <button
                          onClick={() =>
                            setQuantity(Math.min(maxQty, quantity + 1))
                          }
                          className="p-3"
                        >
                          <Plus />
                        </button>
                      </div>
                    </div>
                  )
                );
              })()}

              {/* Actions */}
              {(() => {
                const isOutOfStock =
                  selectedSize?.inStock === false ||
                  (selectedSize?.stock !== undefined &&
                    selectedSize?.stock <= 0);
                return (
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full ${
                        isOutOfStock
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#FC6CB4]"
                      }`}
                    >
                      <ShoppingBag />
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={isOutOfStock}
                      className={`flex-1 px-6 py-3 border rounded-full ${
                        isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Buy Now
                    </button>

                    <button
                      onClick={() => {
                        toggleWishlist(product);

                        trackEvent("AddToWishlist", {
                          content_ids: [product._id || product.id],
                          content_name: product.name,
                          content_type: "product",
                          value: selectedSize.sellingPrice,
                          currency: "INR",
                        });
                      }}
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          isInWishlist(product.id)
                            ? "fill-[#FC6CB4] text-[#FC6CB4]"
                            : "text-black"
                        }`}
                      />
                    </button>
                  </div>
                );
              })()}

              {/* Tabs */}
              <div className="pt-8 border-t">
                <div className="flex gap-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-2 ${
                        activeTab === tab.id
                          ? "border-b-2 border-[#FC6CB4]"
                          : "text-black/50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <p className="mt-6 text-black/70">
                  {tabs.find((t) => t.id === activeTab)?.content}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16 bg-white rounded-3xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Customer Reviews</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-2 bg-[#FC6CB4] text-white rounded-full hover:bg-[#F0A400] transition"
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-8 p-6 bg-gray-50 rounded-xl"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC6CB4] outline-none"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewForm({ ...reviewForm, rating: star })
                        }
                        className="text-2xl"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewForm.rating
                              ? "fill-[#F0A400] text-[#F0A400]"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.message}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, message: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC6CB4] outline-none resize-none"
                    rows={4}
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2 bg-[#731162] text-white rounded-full hover:bg-[#FC6CB4] transition disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#731162] mx-auto"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <div
                  key={review._id || idx}
                  className="border-b pb-6 last:border-0"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold">{review.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-[#F0A400] text-[#F0A400]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </section>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-center text-3xl font-semibold mb-12">
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
