import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { items, getTotal, getItemCount } = useCart();

  const orderId = `ORD${Math.floor(100000 + Math.random() * 900000)}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-28 pb-20 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4">

        {/* SUCCESS ANIMATION */}
        <div className="flex flex-col items-center text-center">

          <div className="relative w-28 h-28 mb-6 success-animate">
            <CheckCircle
              size={112}
              className="text-green-500 animate-check"
              strokeWidth={1.5}
            />
          </div>

          <h1 className="text-3xl font-semibold text-black mb-2">
            Order Placed Successfully!
          </h1>

          <p className="text-black/60 mb-6">
            Thank you for shopping with us. Your order has been confirmed.
          </p>

          <div className="bg-black/5 px-6 py-3 rounded-full text-sm mb-10">
            Order ID: <span className="font-medium">{orderId}</span>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">

          <h2 className="text-xl font-semibold mb-6">
            Order Summary
          </h2>

          <div className="space-y-6">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/5">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-black/60">
                    Qty: {quantity}
                  </p>
                </div>

                <span className="font-medium">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-black/10 mt-8 pt-6 space-y-3">
            <div className="flex justify-between text-black/70">
              <span>Items ({getItemCount()})</span>
              <span>{formatPrice(getTotal())}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold">
              <span>Total Paid</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-4 bg-[#FC6CB4] text-black rounded-full hover:bg-[#F0A400]"
            >
              Continue Shopping
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="flex-1 py-4 bg-black text-white rounded-full"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>

      {/* ANIMATION STYLES */}
      <style>
        {`
          .success-animate {
            animation: popIn 0.6s ease-out forwards;
          }

          .animate-check {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawCheck 1s ease forwards;
          }

          @keyframes drawCheck {
            to {
              stroke-dashoffset: 0;
            }
          }

          @keyframes popIn {
            0% {
              transform: scale(0.6);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </main>
  );
};

export default OrderSuccess;
