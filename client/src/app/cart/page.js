"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, addToCart } from "@/store/slices/cartSlice";
import Link from "next/link";
import Header from "@/components/header";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Footer from "@/components/footer";

const Cart = () => {
  // Get cart items and total quantity from the Redux store
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();

  // console.log("cart items", cartItems);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Calculate total price of the cart
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
    setSnackbarOpen(true); // Show the snackbar alert
  };

  const handleIncreaseQuantity = (item) => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    // console.log("+ 1 updated product", updatedItem);
    dispatch(addToCart(updatedItem)); // Add the updated quantity to the cart
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      // console.log("- 1 updated product", updatedItem);
      dispatch(addToCart(updatedItem)); // Add the updated quantity to the cart
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto text-center px-6 py-14">
        <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-lg text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col lg:flex-row">
            {/* Cart Items Section */}
            <div className="flex-1 max-h-96 overflow-y-auto pr-4 mb-6 lg:mb-0">
              <div className="grid grid-cols-1 gap-6 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row md:items-center justify-between hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Product Image and Details */}
                    <div className="flex items-center mb-4 md:mb-0">
                      <img
                        src={`${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div className="ml-4">
                        <h3 className="text-lg md:text-xl font-semibold">
                          {item.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500">
                          {item.weight}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          Price: ₹{item.price}
                        </p>
                        <div className="flex items-center my-1">
                          <button
                            onClick={() => handleDecreaseQuantity(item)}
                            className="w-6 h-6 md:w-8 md:h-8 flex justify-center items-center text-sm md:text-lg font-semibold text-white bg-neutral-200 rounded-full hover:bg-blue-600 focus:outline-none transition-all duration-300 ease-in-out transform"
                          >
                            -
                          </button>
                          <span className="mx-2 text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseQuantity(item)}
                            className="w-6 h-6 md:w-8 md:h-8 flex justify-center items-center text-sm md:text-lg font-semibold text-white bg-neutral-200 rounded-full hover:bg-blue-600 focus:outline-none transition-all duration-300 ease-in-out transform"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between w-full md:w-auto items-start md:items-end">
                      <p className="text-sm md:text-lg font-bold order-1 md:order-none">
                        Subtotal: ₹{item.price * item.quantity}
                      </p>
                      <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          // Keep the same styling classes
                          className="md:mt-0 text-sm md:text-base text-red-500 hover:text-red-700 transition-colors order-2 md:order-none md:ml-4 flex items-center justify-center"
                          aria-label={`Remove ${item.name} from cart`} // Added ARIA label for accessibility
                      >
                          {/* Replaced 'Remove' text with the DeleteOutline icon */}
                          <DeleteOutline fontSize="small" className="m-2 w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-1/3">
              <h3 className="text-2xl font-bold mb-4">Order Summary</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg">Total Items:</span>
                <span className="text-lg font-bold">{totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg">Total Price:</span>
                <span className="text-lg font-bold">₹{totalPrice}</span>
              </div>
              <Link href="/checkout" passHref>
                <button className="bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}

        <Link href="/" passHref>
          <button className="mt-6 bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition">
            Continue Shopping
          </button>
        </Link>
      </div>

      {/* Snackbar for product removed from cart */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ width: "100%" }}
        >
          Product removed from cart!
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default Cart;
