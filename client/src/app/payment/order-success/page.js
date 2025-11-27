"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function OrderSuccessInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const order_id = searchParams.get("order_id");

  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!order_id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/order-status/${order_id}`
        );
        const data = await res.json();
        setOrderStatus(data);
      } catch (error) {
        console.error("Failed to fetch order status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [order_id]);

  useEffect(() => {
    const handlePopState = () => {
      router.push("/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  if (loading)
    return (
      <div className="text-center p-10 text-lg">Loading order details...</div>
    );
  if (!orderStatus)
    return (
      <div className="text-center p-10 text-red-600">
        Order not found or failed to load.
      </div>
    );

  const { orderId, totalAmount, products, paymentMethod, createdAt, status } =
    orderStatus;

  const singleProducts = products.filter((p) => p.productModel === "Product");

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 rounded-xl shadow-xl my-12">
      {/* Success Icon */}
      <div className="flex flex-col items-center">
        <div className="bg-green-100 rounded-full p-6 mb-4 bounce-scale">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        

        <h1 className="text-4xl font-extrabold text-green-600 mb-2 text-center">
          Payment Successful!
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Your order has been placed successfully.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-green-600">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Order Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <p>
            <span className="font-medium">Order ID:</span> #{orderId}
          </p>
          <p>
            <span className="font-medium">Status:</span> {status}
          </p>
          <p>
            <span className="font-medium">Date:</span>{" "}
            {new Date(createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Payment Method:</span>{" "}
            {paymentMethod === "onlinePayment"
              ? "Online Payment"
              : "Cash on Delivery"}
          </p>
        </div>
      </div>

      {/* Single Products */}
      {singleProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Products</h2>
          <div className="space-y-4">
            {singleProducts.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center p-4 border rounded-lg hover:shadow-lg transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Amount */}
      <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-lg shadow-md text-right mb-8">
        <h3 className="text-xl font-bold text-gray-800">
          Total Paid: <span className="text-green-600">₹{totalAmount}</span>
        </h3>
      </div>

      {/* Back to Home Button */}
      <div className="text-center mb-4">
        <a
          href="/"
          className="inline-block bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ← Back to Home
        </a>
      </div>

      {/* Highlighted Note */}
      <div className="text-center">
        <p className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm">
          ✅ Check your email for the invoice and order details.
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <OrderSuccessInner />
    </Suspense>
  );
}
