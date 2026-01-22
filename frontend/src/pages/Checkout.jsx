import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, getItemCount, clearCart } = useCart();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [addressForm, setAddressForm] = useState({
    area: "",
    flat: "",
    city: "",
    pincode: "",
    instructions: "",
  });

  const subtotal = getTotal();

  const handleAddAddress = () => {
    if (!addressForm.area || !addressForm.city || !addressForm.pincode) {
      alert("Please fill all required fields");
      return;
    }

    setSavedAddresses((prev) => [...prev, addressForm]);
    setSelectedAddress(savedAddresses.length);
    setAddressForm({
      area: "",
      flat: "",
      city: "",
      pincode: "",
      instructions: "",
    });
  };

  const handlePlaceOrder = () => {
    if (selectedAddress === null) {
      alert("Please select or add an address");
      return;
    }

    alert("Order placed successfully!");
    clearCart();
    navigate("/");
  };

  if (items.length === 0) {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT SECTION */}
        <div className="space-y-10">

          <h1 className="text-3xl font-semibold">Checkout</h1>

          {/* ADDRESS */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-medium mb-6">Delivery Address</h2>

            {savedAddresses.length > 0 ? (
              <div className="space-y-4">
                {savedAddresses.map((addr, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAddress(index)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl shadow-md transition ${
                      selectedAddress === index
                        ? "ring-2 ring-[#FC6CB4]"
                        : "hover:shadow-lg"
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium">{addr.area}</p>
                      {addr.flat && (
                        <p className="text-black/60">{addr.flat}</p>
                      )}
                      <p className="text-black/60">
                        {addr.city} – {addr.pincode}
                      </p>
                    </div>
                    {selectedAddress === index && (
                      <Check className="text-[#FC6CB4]" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                <input
                  placeholder="Area / Locality *"
                  value={addressForm.area}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, area: e.target.value })
                  }
                  className="w-full px-5 py-4 rounded-2xl shadow-md"
                />

                <input
                  placeholder="Flat / House No"
                  value={addressForm.flat}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, flat: e.target.value })
                  }
                  className="w-full px-5 py-4 rounded-2xl shadow-md"
                />

                <div className="grid grid-cols-2 gap-5">
                  <input
                    placeholder="City *"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="px-5 py-4 rounded-2xl shadow-md"
                  />

                  <input
                    placeholder="Pincode *"
                    value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, pincode: e.target.value })
                    }
                    className="px-5 py-4 rounded-2xl shadow-md"
                  />
                </div>

                <textarea
                  rows={3}
                  placeholder="Delivery instructions"
                  value={addressForm.instructions}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      instructions: e.target.value,
                    })
                  }
                  className="w-full px-5 py-4 rounded-2xl shadow-md resize-none"
                />

                <button
                  onClick={handleAddAddress}
                  className="px-8 py-4 bg-black text-white rounded-full"
                >
                  Save Address
                </button>
              </div>
            )}
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-medium mb-6">Payment Method</h2>

            {["cod", "online"].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`w-full p-5 rounded-2xl shadow-md text-left ${
                  paymentMethod === method
                    ? "ring-2 ring-[#FC6CB4]"
                    : "hover:shadow-lg"
                }`}
              >
                {method === "cod" ? "Cash on Delivery" : "Online Payment"}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION – ORDER SUMMARY */}
        <div className="bg-black/5 rounded-3xl p-6 sm:p-10 h-fit shadow-lg">
          <h2 className="text-xl font-semibold mb-8">Order Summary</h2>

          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize.ml}`}
                className="flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-black/60">
                    {item.selectedSize.ml} ml × {item.quantity}
                  </p>
                </div>

                <span className="font-medium">
                  {formatPrice(
                    item.selectedSize.sellingPrice * item.quantity
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t mt-8 pt-6 space-y-3">
            <div className="flex justify-between text-black/70">
              <span>Items ({getItemCount()})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full mt-10 py-4 bg-[#FC6CB4] rounded-full"
          >
            Place Order
          </button>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
