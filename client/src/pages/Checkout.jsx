import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { customerService, orderService, paymentService, deliveryService } from "@/services";
import { toast } from "sonner";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, getItemCount, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deliverySettings, setDeliverySettings] = useState(null);

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    street_address1: "",
    apartment_address: "",
    city: "",
    state: "",
    pincode: "",
    lat: 0,
    lng: 0,
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");

  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const response = await deliveryService.getSettings();
        setDeliverySettings(response.settings);
      } catch (error) {
        console.error("Failed to fetch delivery settings:", error);
      }
    };
    fetchDeliverySettings();
  }, []);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const subtotal = getTotal();
  const deliveryCharge = deliverySettings?.freeDeliveryAbove && subtotal >= deliverySettings.freeDeliveryAbove
    ? 0
    : deliverySettings?.baseDeliveryCharge || 0;
  const total = subtotal + deliveryCharge;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!form.phone.trim() || form.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!form.street_address1.trim()) {
      toast.error("Please enter your street address");
      return false;
    }
    if (!form.city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    if (!form.state.trim()) {
      toast.error("Please enter your state");
      return false;
    }
    if (!form.pincode.trim() || form.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const createOrder = async (customerId) => {
    const orderData = {
      customer: customerId,
      products: items.map(item => ({
        product: item.product._id || item.product.id,
        quantity: item.quantity,
        price: item.selectedSize?.sellingPrice || item.product.salePrice || item.product.price,
        name: item.product.name,
      })),
      subtotal,
      deliveryCharge,
      totalAmount: total,
      paymentMethod,
      note: form.note,
    };

    const response = await orderService.create(orderData);
    return response.order;
  };

  const handleCODOrder = async () => {
    setLoading(true);
    try {
      // Create customer
      const customerData = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        shippingAddress: {
          apartment_address: form.apartment_address,
          street_address1: form.street_address1,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          lat: form.lat || 0,
          lng: form.lng || 0,
        },
      };

      const customerResponse = await customerService.create(customerData);
      const customerId = customerResponse.customer._id;

      // Create order
      const order = await createOrder(customerId);

      toast.success("Order placed successfully!");
      clearCart();
      navigate(`/order-success?orderId=${order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    setLoading(true);
    try {
      // Create customer
      const customerData = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        shippingAddress: {
          apartment_address: form.apartment_address,
          street_address1: form.street_address1,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          lat: form.lat || 0,
          lng: form.lng || 0,
        },
      };

      const customerResponse = await customerService.create(customerData);
      const customerId = customerResponse.customer._id;

      // Create order first
      const order = await createOrder(customerId);

      // Create Razorpay order
      const razorpayResponse = await paymentService.createRazorpayOrder(
        total * 100, // Amount in paise
        "INR",
        `order_${order._id}`
      );

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: razorpayResponse.key,
          amount: total * 100,
          currency: "INR",
          name: "MakeMee Cosmetics",
          description: "Order Payment",
          order_id: razorpayResponse.orderId,
          handler: async (response) => {
            try {
              await paymentService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              });

              toast.success("Payment successful!");
              clearCart();
              navigate(`/order-success?orderId=${order._id}`);
            } catch (err) {
              toast.error("Payment verification failed");
            }
          },
          prefill: {
            name: form.fullName,
            email: form.email,
            contact: form.phone,
          },
          theme: {
            color: "#FC6CB4",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    if (paymentMethod === "cashOnDelivery") {
      handleCODOrder();
    } else {
      handleOnlinePayment();
    }
  };

  if (items.length === 0) {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 bg-[#FC6CB4] text-white rounded-full"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT SECTION */}
        <div className="space-y-10">
          <h1 className="text-3xl font-semibold text-black">Checkout</h1>

          {/* CONTACT INFO */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-medium mb-6">Contact Information</h2>
            <div className="space-y-5">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name *"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl shadow-md focus:ring-2 focus:ring-[#FC6CB4] outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl shadow-md focus:ring-2 focus:ring-[#FC6CB4] outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (10 digits) *"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full px-5 py-4 rounded-2xl shadow-md focus:ring-2 focus:ring-[#FC6CB4] outline-none"
                />
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-medium mb-6">Delivery Address</h2>
            <div className="space-y-5">
              <input
                type="text"
                name="street_address1"
                placeholder="Street Address / Locality / Area *"
                value={form.street_address1}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl shadow-md focus:ring-2 focus:ring-[#FC6CB4] outline-none"
              />
              <input
                type="text"
                name="apartment_address"
                placeholder="Flat No / House No / Apartment"
                value={form.apartment_address}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl shadow-md focus:ring-2 focus:ring-[#FC6CB4] outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl shadow-md focus:ring-2 focus:ring-[#FC6CB4] outline-none"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl shadow-md focus:ring-2 focus:ring-[#FC6CB4] outline-none"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode *"
                  value={form.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  className="w-full px-5 py-4 rounded-2xl shadow-md focus:ring-2 focus:ring-[#FC6CB4] outline-none"
                />
              </div>
              <textarea
                name="note"
                rows={3}
                placeholder="Order Notes (optional)"
                value={form.note}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl shadow-md focus:ring-2 focus:ring-[#FC6CB4] outline-none resize-none"
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-medium mb-6">Payment Method</h2>
            <div className="space-y-4">
              <button
                onClick={() => setPaymentMethod("cashOnDelivery")}
                className={`w-full p-5 rounded-2xl shadow-md text-left transition flex items-center justify-between ${
                  paymentMethod === "cashOnDelivery"
                    ? "ring-2 ring-[#FC6CB4]"
                    : "hover:shadow-lg"
                }`}
              >
                <span>Cash on Delivery</span>
                {paymentMethod === "cashOnDelivery" && <Check className="text-[#FC6CB4]" />}
              </button>
              <button
                onClick={() => setPaymentMethod("onlinePayment")}
                className={`w-full p-5 rounded-2xl shadow-md text-left transition flex items-center justify-between ${
                  paymentMethod === "onlinePayment"
                    ? "ring-2 ring-[#FC6CB4]"
                    : "hover:shadow-lg"
                }`}
              >
                <span>Online Payment (Razorpay)</span>
                {paymentMethod === "onlinePayment" && <Check className="text-[#FC6CB4]" />}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION – ORDER SUMMARY */}
        <div className="bg-black/5 rounded-3xl p-6 sm:p-10 h-fit shadow-lg sticky top-28">
          <h2 className="text-xl font-semibold mb-8">Order Summary</h2>

          <div className="space-y-6 max-h-[300px] overflow-y-auto">
            {items.map(({ product, selectedSize, quantity }) => (
              <div key={`${product._id || product.id}-${selectedSize?.ml}`} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow flex-shrink-0">
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">{product.name}</p>
                  <p className="text-sm text-black/60">
                    {selectedSize?.ml ? `${selectedSize.ml}ml` : product.weight} × {quantity}
                  </p>
                </div>
                <span className="font-medium text-sm sm:text-base">
                  {formatPrice((selectedSize?.sellingPrice || product.salePrice || product.price) * quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-black/10 mt-8 pt-6 space-y-3">
            <div className="flex justify-between text-black/70">
              <span>Subtotal ({getItemCount()} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-black/70">
              <span>Delivery</span>
              <span>{deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}</span>
            </div>
            {deliverySettings?.freeDeliveryAbove && subtotal < deliverySettings.freeDeliveryAbove && (
              <p className="text-xs text-[#FC6CB4]">
                Add {formatPrice(deliverySettings.freeDeliveryAbove - subtotal)} more for free delivery
              </p>
            )}
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-black/10">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full mt-10 py-4 bg-[#FC6CB4] text-black rounded-full hover:bg-[#F0A400] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : paymentMethod === "cashOnDelivery" ? "Place Order" : "Proceed to Pay"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
