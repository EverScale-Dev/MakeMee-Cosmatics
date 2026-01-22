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

import { getProductById, products } from "@/data/products";
import { productService } from "@/services";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePageTransition } from "@/hooks/useGSAP";
import { toast } from "sonner";

// Transform backend product to expected format
const transformBackendProduct = (p) => {
  // If product already has sizes array, use it
  if (p.sizes && p.sizes.length > 0) {
    return {
      ...p,
      id: p._id || p.id,
    };
  }
  // Otherwise, create sizes from regularPrice/salePrice
  return {
    ...p,
    id: p._id || p.id,
    sizes: [{
      ml: parseInt(p.weight) || 30,
      originalPrice: p.regularPrice || p.salePrice || 0,
      sellingPrice: p.salePrice || p.regularPrice || 0,
      inStock: true,
    }],
    images: p.images || ['/placeholder.png'],
    rating: p.rating || 4.5,
    shortDescription: p.description || p.shortDescription || '',
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

  // Fetch product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      // Try mock data first (for development with mock IDs like "1", "4")
      const mockProduct = getProductById(id);
      if (mockProduct) {
        setProduct(mockProduct);
        setSelectedSize(mockProduct.sizes?.[0]);
        setLoading(false);
        return;
      }

      // If not in mock, try API
      try {
        const data = await productService.getById(id);
        const transformed = transformBackendProduct(data);
        setProduct(transformed);
        setSelectedSize(transformed.sizes?.[0]);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="pt-28 pb-20 min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#731162]"></div>
      </main>
    );
  }

  if (!product || !selectedSize || error) {
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

  const totalSellingPrice = selectedSize.sellingPrice * quantity;
  const totalOriginalPrice = selectedSize.originalPrice * quantity;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      quantity,
    });

    toast.success(
      `${quantity} × ${product.name} (${selectedSize.ml} ml) added to cart`
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  // Related products from mock data (or could fetch from API)
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.tags?.some((tag) => product.tags?.includes(tag))
    )
    .slice(0, 4);

  const tabs = [
    { id: "description", label: "Description", content: product.shortDescription},
    {
      id: "ingredients",
      label: "Ingredients",
      content: product.ingredients?.join(", "),
    },
    { id: "usage", label: "How to Use", content: product.usage },
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
                  src={product.images[selectedImage]}
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
                    <img src={img} className="w-full h-full object-cover" />
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

              {/* Size Selector */}
              <div>
                <p className="font-medium mb-2">Select Size</p>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.ml}
                      onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                      }}
                      className={`px-4 py-2 rounded-full border ${
                        selectedSize.ml === size.ml
                          ? "border-[#FC6CB4] bg-[#FC6CB4]/20"
                          : "border-black/20"
                      }`}
                    >
                      {size.ml} ml
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold">
                  ₹{totalSellingPrice}
                </span>

                <span className="text-lg line-through text-black/40">
                  ₹{totalOriginalPrice}
                </span>

                <span className="text-sm bg-[#F0A400]/20 px-2 rounded">
                  {Math.round(
                    (1 -
                      selectedSize.sellingPrice /
                        selectedSize.originalPrice) *
                      100
                  )}
                  % OFF
                </span>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <Check className="text-[#731162]" />
                <span className="text-[#731162] font-medium">In Stock</span>
              </div>

              {/* Quantity */}
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
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3"
                  >
                    <Plus />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#FC6CB4] rounded-full"
                >
                  <ShoppingBag />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 border rounded-full"
                >
                  Buy Now
                </button>

                <button onClick={() => toggleWishlist(product)}>
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
