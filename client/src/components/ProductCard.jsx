import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { gsap } from "gsap";
import { trackEvent } from "@/utils/metaPixel";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { optimizeImage } from "@/utils/cloudinaryUrl";

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  // Get product ID (support both _id from backend and id from mock)
  const productId = product._id || product.id;

  // Handle both sizes array and single price (backward compatibility)
  const hasSizes = product.sizes && product.sizes.length > 0;
  const [selectedSize] = useState(
    hasSizes ? product.sizes[0] : null,
  );

  // Get display price (from size if available, otherwise from root product)
  const displayPrice = hasSizes
    ? (selectedSize?.sellingPrice || selectedSize?.originalPrice || 0)
    : (product.salePrice || product.regularPrice || 0);
  const displayOriginalPrice = hasSizes
    ? (selectedSize?.originalPrice || selectedSize?.sellingPrice || 0)
    : (product.regularPrice || product.salePrice || 0);

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image) return;

    const hasHoverImage = product.images && product.images.length > 1;

    // Optimize images for card display
    const optimizedImage0 = optimizeImage(product.images?.[0], { width: 1400 });
    const optimizedImage1 = hasHoverImage
      ? optimizeImage(product.images[1], { width: 1400 })
      : null;

    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -10,
        boxShadow: "0 10px 30px rgba(115,17,98,0.25)",
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(image, { scale: 1.05, duration: 0.4 });

      if (hasHoverImage) {
        gsap.to(image, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            image.src = optimizedImage1;
            gsap.to(image, { opacity: 1, duration: 0.2, scale: 1.5 });
          },
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        duration: 0.4,
      });

      gsap.to(image, { scale: 1, duration: 0.4 });

      if (hasHoverImage) {
        gsap.to(image, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            image.src = optimizedImage0;
            gsap.to(image, { opacity: 1, duration: 0.2 });
          },
        });
      }
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [product.images]);

  const inCart = isInCart(productId, selectedSize?.ml);

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      id: productId,
      quantity: 1,
    };
    // Only include selectedSize if product has sizes
    if (selectedSize) {
      cartItem.selectedSize = selectedSize;
    }
    addToCart(cartItem);
    trackEvent("AddToCart", {
      content_ids: [productId],
      content_name: product.name,
      content_type: "product",
      value: displayPrice,
      currency: "INR",
    });
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl shadow-md overflow-hidden group"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden aspect-square">
        <Link to={`/product/${productId}`}>
          <img
            ref={imageRef}
            src={
              optimizeImage(product.images?.[0], { width: 1400 }) ||
              "/placeholder.png"
            }
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </Link>

        {/* BADGE */}
        {product.badge && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-[#FC6CB4] text-white text-xs font-medium rounded-full">
            {product.badge}
          </span>
        )}

        {/* ACTION BUTTONS */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              toggleWishlist({ ...product, id: productId });

              trackEvent("AddToWishlist", {
                content_ids: [productId],
                content_name: product.name,
                content_type: "product",
                value: displayPrice,
                currency: "INR",
              });
            }}
            className={`p-2 rounded-full shadow-lg
              ${
                isInWishlist(productId)
                  ? "bg-red-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
          >
            <Heart
              size={18}
              fill={isInWishlist(productId) ? "white" : "none"}
            />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={inCart}
            className={`p-2 rounded-full shadow-lg
              ${
                inCart
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <Link to={`/product/${productId}`}>
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            {product.brand || product.category || "MakeMee"}
          </p>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* PRICE */}
        <div className="flex items-center justify-between">
          <div>
            {displayOriginalPrice > displayPrice && (
              <span className="text-sm text-gray-400 line-through mr-2">
                ₹{displayOriginalPrice}
              </span>
            )}
            <span className="text-lg font-bold text-gray-900">
              ₹{displayPrice}
            </span>
            {selectedSize?.ml && (
              <p className="text-xs text-gray-500">
                {selectedSize.ml} {selectedSize.unit || "ml"}
              </p>
            )}
            {!selectedSize?.ml && product.weight && (
              <p className="text-xs text-gray-500">{product.weight}</p>
            )}
          </div>

          {product.rating > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-yellow-500 mr-1">★</span>
              {product.rating}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
