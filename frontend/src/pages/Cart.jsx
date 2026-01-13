import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash, X, Check } from "lucide-react";
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

  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("online");

  /* MOCK ADDRESSES (replace with user data later) */
  const addresses = [
    "Flat 301, Rose Residency, Pune, Maharashtra",
    "12B, Sunrise Apartments, Mumbai, Maharashtra",
  ];

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
    <>
      <main
        className={`pt-28 pb-20 min-h-screen bg-white transition ${
          showCheckout ? "blur-sm" : ""
        }`}
      >
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
                <span>{formatPrice(getTotal())}</span>
              </div>

              <div className="flex justify-between text-black/70">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between text-lg font-semibold text-black pt-4 border-t border-black/10">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="mt-10 px-10 py-4 bg-[#FC6CB4] text-black rounded-full hover:bg-[#F0A400]"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </main>

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 relative">

            {/* Close */}
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h2 className="text-2xl font-semibold text-black mb-6">
              Checkout
            </h2>

            {/* ADDRESSES */}
            <div className="mb-8">
              <h3 className="font-medium mb-3">Select Address</h3>
              <div className="space-y-3">
                {addresses.map((addr, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAddress(index)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border ${
                      selectedAddress === index
                        ? "border-[#FC6CB4]"
                        : "border-black/10"
                    }`}
                  >
                    <span className="text-sm text-black">{addr}</span>
                    {selectedAddress === index && (
                      <Check className="text-[#FC6CB4]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* PAYMENT */}
            <div className="mb-10">
              <h3 className="font-medium mb-3">Payment Method</h3>
              <div className="space-y-3">
                {["online", "cod"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`w-full px-4 py-3 rounded-xl border text-left ${
                      paymentMethod === method
                        ? "border-[#FC6CB4]"
                        : "border-black/10"
                    }`}
                  >
                    {method === "online"
                      ? "Online Payment"
                      : "Cash on Delivery"}
                  </button>
                ))}
              </div>
            </div>

            {/* CONFIRM */}
            <button
              className="w-full py-4 bg-[#FC6CB4] text-black rounded-full hover:bg-[#F0A400]"
              onClick={() => {
                alert("Order placed successfully!");
                setShowCheckout(false);
              }}
            >
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
