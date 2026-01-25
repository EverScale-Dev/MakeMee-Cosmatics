import React from "react";
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

  const subtotal = getTotal();

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
          {items.map(({ product, selectedSize, quantity }) => {
            // Get price with fallbacks to avoid NaN
            const unitPrice = selectedSize?.sellingPrice ||
              product.salePrice ||
              product.price ||
              0;
            const totalPrice = unitPrice * (quantity || 1);
            const sizeLabel = selectedSize?.ml ? ` (${selectedSize.ml}${selectedSize.unit || 'ml'})` : '';

            return (
              <div
                key={`${product.id}-${selectedSize?.ml || ''}`}
                className="flex gap-6 pb-8 border-b border-black/10"
              >
                <div className="w-28 h-28 bg-black/5 rounded-xl overflow-hidden">
                  <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black">
                    {product.name}{sizeLabel}
                  </h3>
                  <p className="text-sm text-black/60">
                    {product.shortDescription || `₹${unitPrice} each`}
                  </p>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center bg-black/5 rounded-full">
                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity - 1, selectedSize?.ml)
                        }
                        className="p-3"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-10 text-center">{quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(product.id, quantity + 1, selectedSize?.ml)
                        }
                        className="p-3"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="font-semibold">
                        {formatPrice(totalPrice)}
                      </span>
                      <button
                        onClick={() => removeFromCart(product.id, selectedSize?.ml)}
                        className="text-black/50 hover:text-black"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

            <div className="flex justify-between text-lg font-semibold text-black pt-4 border-t border-black/10">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <p className="text-sm text-black/50 pt-2">
              Shipping calculated at checkout. Apply coupons at checkout.
            </p>
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
