import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

const Cart = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount,
  } = useCart();

  /* PROMO STATE */
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  /* PROMO LOGIC (mock) */
  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();

    if (code === "SAVE10") {
      setDiscount(0.1);
      setPromoError("");
    } else if (code === "SAVE20") {
      setDiscount(0.2);
      setPromoError("");
    } else {
      setDiscount(0);
      setPromoError("Invalid promo code");
    }
  };

  const subtotal = getTotal();
  const discountAmount = subtotal * discount;
  const finalTotal = subtotal - discountAmount;

  /* EMPTY CART */
  if (items.length === 0) {
    return (
      <main className="pt-28 pb-20 min-h-screen bg-white text-center">
        <h1 className="text-3xl font-semibold text-black mb-4">
          Your cart is empty
        </h1>
        <p className="text-black/60 mb-8">
          Looks like you haven’t added anything yet.
        </p>
        <Link to="/shop">
          <button className="px-8 py-3 bg-[#FC6CB4] text-black rounded-full hover:bg-[#F0A400] transition">
            Continue Shopping
          </button>
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4">

        <h1 className="text-3xl font-semibold text-black mb-12">
          Shopping Cart
        </h1>

        {/* CART ITEMS */}
        <div className="space-y-8">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-6 pb-8 border-b border-black/10"
            >
              <div className="w-28 h-28 bg-black/5 rounded-xl overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black">
                  {product.name}
                </h3>
                <p className="text-sm text-black/60">
                  {product.shortDescription}
                </p>

                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center bg-black/5 rounded-full">
                    <button
                      onClick={() =>
                        updateQuantity(product.id, quantity - 1)
                      }
                      className="p-3"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-10 text-center">{quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(product.id, quantity + 1)
                      }
                      className="p-3"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="font-semibold">
                      {formatPrice(product.price * quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-black/50 hover:text-black"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={clearCart}
          className="mt-6 text-sm text-black/60 underline"
        >
          Clear Cart
        </button>

        {/* SUMMARY */}
        <div className="mt-16 pt-8 border-t border-black/20">
          <div className="space-y-4 max-w-md">

            <div className="flex justify-between text-black/70">
              <span>Items ({getItemCount()})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between text-black/70">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            {/* PROMO CODE */}
            <div className="pt-6 space-y-3">
              <label className="text-sm font-medium text-black">
                Promo Code
              </label>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-4 py-3 rounded-xl border border-black/10 focus:outline-none"
                />
                <button
                  onClick={applyPromo}
                  className="px-6 rounded-xl bg-black text-white"
                >
                  Apply
                </button>
              </div>

              {promoError && (
                <p className="text-sm text-red-500">{promoError}</p>
              )}

              {discount > 0 && (
                <p className="text-sm text-green-600">
                  Promo applied: {discount * 100}% off
                </p>
              )}
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600 pt-2">
                <span>Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-semibold text-black pt-4 border-t border-black/10">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <Link to="/checkout">
            <button
            
            className="mt-10 px-10 py-4 bg-[#FC6CB4] text-black rounded-full hover:bg-[#F0A400]"
            >
            Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Cart;
