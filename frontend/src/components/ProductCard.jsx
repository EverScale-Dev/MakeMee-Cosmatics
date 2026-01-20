import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { gsap } from "gsap";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  


  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
  const card = cardRef.current;
  const image = imageRef.current;
  if (!card || !image) return;

  const hasHoverImage = product.images.length > 1;

  const handleMouseEnter = () => {
    gsap.to(card, {
      y: -10,
      boxShadow: "0 10px 30px rgba(115 17 98, 0.6)",
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(image, { scale: 1.05, duration: 0.4 });

    if (hasHoverImage) {
      gsap.to(image, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          image.src = product.images[1];
          gsap.to(image, { opacity: 1, duration: 0.2 });
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
          image.src = product.images[0];
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


  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl shadow-md overflow-hidden group"
    >
      <div className="relative overflow-hidden aspect-square">
        <Link to={`/product/${product.id}`}>
          <img
            ref={imageRef}
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* ACTION BUTTONS */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* WISHLIST */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`p-2 rounded-full shadow-lg transition-colors
              ${
                isInWishlist(product.id)
                  ? "bg-red-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }
            `}
          >
            <Heart
              size={18}
              fill={isInWishlist(product.id) ? "white" : "none"}
            />
          </button>

          {/* CART */}
          <button
            onClick={() => addToCart(product)}
            disabled={isInCart(product.id)}
            className={`p-2 rounded-full shadow-lg transition-colors
              ${
                isInCart(product.id)
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }
            `}
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* BADGE */}
        {product.badge && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.badge}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            {product.category}
          </p>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through mr-2">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
          </div>

          {product.rating && (
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
