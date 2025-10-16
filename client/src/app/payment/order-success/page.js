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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/order-status/${order_id}`);
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

  if (loading) return <div className="text-center p-10 text-lg">Loading order details...</div>;
  if (!orderStatus) return <div className="text-center p-10 text-red-600">Order not found or failed to load.</div>;

  const { orderId, totalAmount, products, paymentMethod, createdAt, status } = orderStatus;

  const singleProducts = products.filter(p => p.productModel === "Product");

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md my-10">
      <h1 className="text-3xl font-bold text-green-600 mb-4 text-center">🎉 Payment Successful!</h1>

      <div className="mb-6 border-b pb-4">
        <p><span className="font-semibold">Order ID:</span> #{orderId}</p>
        <p><span className="font-semibold">Status:</span> {status}</p>
        <p><span className="font-semibold">Date:</span> {new Date(createdAt).toLocaleString()}</p>
        <p><span className="font-semibold">Payment Method:</span> {paymentMethod === "onlinePayment" ? "Online Payment" : "Cash on Delivery"}</p>
      </div>

      {/* Single Products Section */}
      {singleProducts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-2">🧩 Single Products</h2>
          <div className="space-y-4">
            {singleProducts.map(item => (
              <div key={item._id} className="border rounded p-4 shadow-sm">
                <p className="font-semibold">{item.name}</p>
                <p>Qty: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Section */}
      <div className="mt-6 text-right">
        <h3 className="text-lg font-bold text-gray-800">Total Paid: ₹{totalAmount}</h3>
      </div>

      <div className="mt-6 text-center">
        <a href="/" className="text-blue-600 underline hover:text-blue-800 transition">← Back to Home</a>
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
