"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCart } from "@/store/slices/cartSlice";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Swal from "sweetalert2";
import GoogleApiAutocomplete from "@/components/GoogleApiAutocomplete";
import Footer from "@/components/footer";
import BoltIcon from "@mui/icons-material/Bolt";
import Script from "next/script";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryCharge = totalAmount < 500 ? 40 : 0;
  const finalAmount = totalAmount + deliveryCharge;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ email: "", phone: "" });
  const [apartment_address, setApartment_address] = useState("");
  const [addressComponents, setAddressComponents] = useState({});
  const [shippingAddress, setShippingAddress] = useState({
    street_address1: "",
    apartment_address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    lat: "",
    lng: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Example: Matches 10-digit numbers
    return phoneRegex.test(phone);
  };

  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery"); // Default payment method

  const handleAddressSelect = (selectedAddressComponents) => {
    setAddressComponents(selectedAddressComponents);

    // Update the shippingAddress state with the selected address components
    setShippingAddress({
      street_address1: selectedAddressComponents.street_address1 || "",
      city: selectedAddressComponents.city || "",
      state: selectedAddressComponents.state || "",
      pincode: selectedAddressComponents.pincode || "",
      country: selectedAddressComponents.country || "",
      lat: selectedAddressComponents.latitude || "",
      lng: selectedAddressComponents.longitude || "",
      apartment_address,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setApartment_address(value);
    setShippingAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleApartmentAddressChange = (e) => {
    const { value } = e.target;
    setApartment_address(value);
    setShippingAddress((prevAddress) => ({
      ...prevAddress,
      apartment_address: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    const newErrors = { email: "", phone: "" };

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!validatePhone(phone)) {
      newErrors.phone = "Phone number must be a 10-digit number.";
    }

    setErrors(newErrors);

    const customerData = {
      fullName,
      email,
      phone,
      shippingAddress,
    };

    setLoading(true);
    try {
      // Step 1: Create Customer
      let customerResponse;
      try {
        customerResponse = await axios.post(
          `
          ${process.env.NEXT_PUBLIC_API_BASE_URL}/customers`,
          customerData
        );
      } catch (error) {
        console.error("Error creating customer:", error);
        await Swal.fire({
          title: "Error",
          text: "Failed to create customer. Please try again.",
          icon: "error",
        });
        return;
      }

      const customerId = customerResponse.data.customer._id;
      // console.log("customerResponse.data.customer", customerResponse.data);

      // Step 2: Create Order
      const orderData = {
        customer: customerId,
        products: cartItems.map((item) => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          productModel: "Product",
        })),
        totalQuantity,
        subtotal: totalAmount,
        deliveryCharge,
        totalAmount: finalAmount,
        paymentMethod,
        note: note,
      };


      let orderResponse;
      try {
        orderResponse = await axios.post(
          `
          ${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`,
          orderData
        );
      } catch (error) {
        console.error("Error creating order:", error);
        await Swal.fire({
          title: "Error",
          text: "Failed to place order. Please try again.",
          icon: "error",
        });
        return;
      }

      // console.log("orderResponse", orderResponse.data);

      // 3. If Online Payment, trigger Razorpay Checkout
      if (paymentMethod === "onlinePayment") {
        // Call backend to create Razorpay order
        const razorpayOrderRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/razorpay/order`,
          {
            amount: totalAmount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: orderResponse.data._id,
            customer: {
              name: fullName,
              email,
              contact: phone,
            },
          }
        );

        const { orderId, key } = razorpayOrderRes.data;

        const options = {
          key,
          amount: finalAmount * 100,
          currency: "INR",
          name: "MakeMee Cosmatics",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response) {
            // Verify payment on backend
            try {
              const verifyRes = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/razorpay/verify`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  // orderId: orderResponse.data._id,
                  orderId: orderResponse.data.order._id,
                }
              );
              if (verifyRes.data.success) {
                await Swal.fire({
                  title: "Payment Successful!",
                  text: "Your order has been placed successfully!",
                  icon: "success",
                });
                // dispatch(clearCart());
                router.push(
                  `/payment/order-success?order_id=${orderResponse.data.order._id}`
                );
              } else {
                throw new Error("Payment verification failed");
              }
            } catch (err) {
              await Swal.fire({
                title: "Payment Failed",
                text: "Payment verification failed. Please contact support.",
                icon: "error",
              });
            }
          },
          prefill: {
            name: fullName,
            email,
            contact: phone,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
        return; // Don't show success alert here, wait for payment handler
      }

      await Swal.fire({
        title: "Order Placed!",
        text: "Your order has been placed successfully!",
        icon: "success",
      });

      // Clear cart and redirect to success page (same as online)
      dispatch(clearCart());
      router.push(
        `/payment/order-success?order_id=${orderResponse.data.order._id}`
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      await Swal.fire({
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-6 text-center">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column - Shipping Information */}
          <div className="p-8 bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">
              Shipping Information
            </h2>
            {loading ? (
              <div className="flex justify-center items-center">
                <CircularProgress />
                <span className="ml-2">Placing order...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Full Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
                <TextField
                  label="Phone"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  required
                />

                {/* Shipping Address Fields */}
                <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>

                <GoogleApiAutocomplete onAddressSelect={handleAddressSelect} />

                <TextField
                  label="Flat No / House No / Apartment"
                  name="apartment_address"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={apartment_address}
                  onChange={handleApartmentAddressChange}
                  required
                />

                <Box className="flex space-x-4" sx={{ mb: 2 }}>
                  <TextField
                    label="City"
                    name="city"
                    variant="outlined"
                    fullWidth
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                  <TextField
                    label="Pin Code"
                    name="pincode"
                    variant="outlined"
                    fullWidth
                    value={shippingAddress.pincode}
                    onChange={handleAddressChange}
                    required
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Instructions For The Order"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    name="note"
                    placeholder="Add a note (optional)"
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Box>

                <fieldset sx={{ mb: 2 }}>
                  <legend className="block text-gray-700 mb-2">
                    Payment Method
                  </legend>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="cashOnDelivery"
                      name="paymentMethod"
                      value="cashOnDelivery"
                      checked={paymentMethod === "cashOnDelivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="cashOnDelivery" className="ml-2 flex">
                      <img
                        src="/rupee.png"
                        alt="Cash on Delivery Icon"
                        className="mr-2"
                        style={{ width: "20px", height: "20px" }}
                      />
                      Cash on Delivery
                    </label>
                  </div>
                  <div className="flex items-center" sx={{ mb: 1 }}>
                    <input
                      type="radio"
                      id="onlinePayment"
                      name="paymentMethod"
                      value="onlinePayment"
                      checked={paymentMethod === "onlinePayment"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="onlinePayment" className="ml-2">
                      Online Payment
                    </label>
                  </div>
                </fieldset>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "green",
                    "&:hover": {
                      backgroundColor: "darkgreen",
                    },
                  }}
                  className={loading ? "opacity-50 cursor-not-allowed" : ""}
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div
            className="p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl"
            style={{ position: "sticky", top: "20px" }}
          >
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

            {/* Cart Items */}
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-center mb-4"
                  >
                    <div className="flex items-center mb-4 sm:mb-0">
                      <img
                        src={`${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.weight}</p>
                        <p className="text-gray-600">
                          {item.quantity} x ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                {/* Button to Modify Cart */}
                <Box className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-4">
                  <Link href="/cart" passHref>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className="w-full sm:w-auto mt-4 sm:mt-0"
                    >
                      Modify Cart
                    </Button>
                  </Link>
                </Box>

                {/* Total Price */}
                {/* Order Summary Totals */}
                <div className="border-t mt-4 pt-4">
                  <div className="flex flex-col sm:flex-row justify-between mb-2">
                    <p>Total Items:</p>
                    <p>{totalQuantity}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between mb-2">
                    <p>Subtotal:</p>
                    <p>₹{totalAmount.toFixed(2)}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between mb-2">
                    <p>Delivery Charges:</p>
                    <p>₹{deliveryCharge.toFixed(2)}</p>
                  </div>

                  {/* 💡 Offer Message */}
                  {totalAmount >= 500 ? (
                    <p className="text-sm text-green-600 mt-2 font-medium text-center">
                      🎉 Free delivery on orders above ₹500!
                    </p>
                  ) : (
                    <p className="text-sm text-orange-600 mt-2 text-center">
                      Add items worth ₹{(500 - totalAmount).toFixed(2)} more for free delivery 🚚
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between font-bold mt-3">
                    <p>Total Amount:</p>
                    <p>₹{finalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </>
            ) : (
              <p>No items in the cart.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
