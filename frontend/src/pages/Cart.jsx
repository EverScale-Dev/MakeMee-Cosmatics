import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  /* PROMO STATE */
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  /* PROMO LOGIC */
  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "SAVE10") setDiscount(0.1);
    else if (code === "SAVE20") setDiscount(0.2);
    else {
      setDiscount(0);
      setPromoError("Invalid promo code");
      return;
    }
    setPromoError("");
  };

  /* PRICE CALCULATIONS */
  const subtotal = items.reduce(
    (sum, item) =>
      sum + item.selectedSize.sellingPrice * item.quantity,
    0
  );

  const discountAmount = subtotal * discount;
  const finalTotal = subtotal - discountAmount;

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /* EMPTY CART */
  if (items.length === 0) {
    return (
      <main className="pt-28 pb-20 min-h-screen bg-white text-center">
        <h1 className="text-3xl font-semibold mb-4">Your cart is empty</h1>
        <Link to="/shop">
          <button className="px-8 py-3 bg-[#FC6CB4] rounded-full">
            Continue Shopping
          </button>
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4">

        <h1 className="text-3xl font-semibold mb-12">Shopping Cart</h1>

        {/* CART ITEMS */}
        <div className="space-y-8">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.selectedSize.ml}`}
              className="flex gap-6 pb-8 border-b"
            >
              <div className="w-28 h-28 bg-black/5 rounded-xl overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-black/60">
                  {item.selectedSize.ml} ml
                </p>

                <div className="flex justify-between items-center mt-6">
                  {/* QUANTITY */}
                  <div className="flex items-center bg-black/5 rounded-full">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedSize.ml,
                          item.quantity - 1
                        )
                      }
                      className="p-3"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-10 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedSize.ml,
                          item.quantity + 1
                        )
                      }
                      className="p-3"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* PRICE */}
                  <div className="flex items-center gap-6">
                    <span className="font-semibold">
                      ₹
                      {item.selectedSize.sellingPrice *
                        item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        removeFromCart(item.id, item.selectedSize.ml)
                      }
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
        <div className="mt-16 pt-8 border-t">
          <div className="space-y-4 max-w-md">

            <div className="flex justify-between text-black/70">
              <span>Items ({totalItems})</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-black/70">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            {/* PROMO */}
            <div className="pt-6 space-y-3">
              <label className="text-sm font-medium">Promo Code</label>
              <div className="flex gap-3">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-4 py-3 rounded-xl border"
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
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-semibold pt-4 border-t">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          <Link to="/checkout">
            <button className="mt-10 px-10 py-4 bg-[#FC6CB4] rounded-full">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Cart;
