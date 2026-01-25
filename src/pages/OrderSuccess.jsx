import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import { orderService } from "@/services";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoiceStatus, setInvoiceStatus] = useState("pending");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const data = await orderService.getById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Generate and send invoice after order is loaded
  useEffect(() => {
    const sendInvoice = async () => {
      if (!order?.orderId) return;

      try {
        setInvoiceStatus("sending");
        const result = await orderService.generateInvoice(order.orderId);
        if (result.alreadySent) {
          setInvoiceStatus("already_sent");
        } else {
          setInvoiceStatus("sent");
        }
      } catch (error) {
        console.error("Failed to send invoice:", error);
        setInvoiceStatus("failed");
      }
    };

    sendInvoice();
  }, [order?.orderId]);

  // Loading state
  if (loading) {
    return (
      <main className="pt-28 pb-20 min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-[#FC6CB4]" />
      </main>
    );
  }

  // No order found
  if (!order) {
    return (
      <main className="pt-28 pb-20 min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-semibold text-black mb-4">
            Order Not Found
          </h1>
          <p className="text-black/60 mb-6">
            We couldn't find your order details.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#FC6CB4] text-black rounded-full hover:bg-[#F0A400]"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

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

          <p className="text-black/60 mb-4">
            Thank you for shopping with us. Your order has been confirmed.
          </p>

          {/* Invoice Status */}
          <div className="mb-6 text-sm">
            {invoiceStatus === "sending" && (
              <span className="text-blue-600">Sending invoice to your email...</span>
            )}
            {invoiceStatus === "sent" && (
              <span className="text-green-600">Invoice sent to {order.customer?.email}</span>
            )}
            {invoiceStatus === "already_sent" && (
              <span className="text-gray-600">Invoice already sent to your email</span>
            )}
            {invoiceStatus === "failed" && (
              <span className="text-red-600">Failed to send invoice</span>
            )}
          </div>

          <div className="bg-black/5 px-6 py-3 rounded-full text-sm mb-10">
            Order ID: <span className="font-medium">#{order.orderId}</span>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          <div className="space-y-6">
            {order.products?.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/5">
                  <img
                    src={item.product?.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-black/60">Qty: {item.quantity}</p>
                </div>

                <span className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-black/10 mt-8 pt-6 space-y-3">
            <div className="flex justify-between text-black/70">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal || 0)}</span>
            </div>

            <div className="flex justify-between text-black/70">
              <span>Delivery</span>
              <span>
                {order.deliveryCharge === 0
                  ? "FREE"
                  : formatPrice(order.deliveryCharge || 0)}
              </span>
            </div>

            {order.couponCode && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({order.couponCode})</span>
                <span>-{formatPrice(order.couponDiscount || 0)}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-black/10">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>

            <div className="flex justify-between text-sm text-black/60 pt-2">
              <span>Payment Method</span>
              <span>
                {order.paymentMethod === "cashOnDelivery"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </span>
            </div>

            <div className="flex justify-between text-sm text-black/60">
              <span>Status</span>
              <span className="capitalize">{order.status}</span>
            </div>
          </div>

          {/* Shipping Address */}
          {order.customer?.shippingAddress && (
            <div className="border-t border-black/10 mt-6 pt-6">
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <p className="text-sm text-black/70">
                {order.customer.fullName}
                <br />
                {order.customer.shippingAddress.apartment_address && (
                  <>{order.customer.shippingAddress.apartment_address}, </>
                )}
                {order.customer.shippingAddress.street_address1}
                <br />
                {order.customer.shippingAddress.city},{" "}
                {order.customer.shippingAddress.state} -{" "}
                {order.customer.shippingAddress.pincode}
                <br />
                Phone: {order.customer.phone}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-4 bg-[#FC6CB4] text-black rounded-full hover:bg-[#F0A400]"
            >
              Continue Shopping
            </button>

            <button
              onClick={() => navigate("/profile")}
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
