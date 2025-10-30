"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, addToCart } from "@/store/slices/cartSlice";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

const CartSidebar = ({ open, onClose }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();

  const handleIncrease = (item) => {
    dispatch(addToCart({ ...item, quantity: item.quantity + 1 }));
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(addToCart({ ...item, quantity: item.quantity - 1 }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sidebar Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 mt-8">
                  Your cart is empty.
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-md"
                      />
                      <div className="ml-3">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          ₹{item.price} × {item.quantity}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center mt-1">
                          <button
                            onClick={() => handleDecrease(item)}
                            className="px-2 py-1 border rounded-l text-sm hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrease(item)}
                            className="px-2 py-1 border rounded-r text-sm hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700 transition ml-2"
                    >
                      <DeleteOutline fontSize="small" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-white">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Total Items:</span>
                <span>{totalQuantity}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-semibold text-lg">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="space-y-2">
                <Link href="/checkout">
                  <button
                    onClick={onClose}
                    className="w-full bg-blue-900 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
                  >
                    Checkout
                  </button>
                </Link>
                <Link href="/cart">
                  <button
                    onClick={onClose}
                    className="w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    View Full Cart
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
