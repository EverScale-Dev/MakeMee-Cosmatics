import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderService } from "@/services";
import {
  Home,
  Package,
  Truck,
  Warehouse,
  ClipboardCheck,
  PackageCheck,
  ArrowLeft,
} from "lucide-react";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusSteps = (order, tracking) => {
  const steps = [
    {
      id: 1,
      title: "Order Placed",
      date: formatDate(order?.createdAt),
      icon: ClipboardCheck,
      status: "completed",
    },
    {
      id: 2,
      title: "Order Confirmed",
      date: order?.status !== "pending payment" ? formatDate(order?.updatedAt) : "",
      icon: Package,
      status: ["processing", "shipped", "delivered", "completed"].includes(order?.status) ? "completed" : "pending",
    },
    {
      id: 3,
      title: "Shipped",
      date: tracking?.shipped_date ? formatDate(tracking.shipped_date) : "",
      icon: Warehouse,
      status: tracking?.current_status === "SHIPPED" || tracking?.current_status === "IN TRANSIT" || tracking?.current_status === "OUT FOR DELIVERY" || tracking?.current_status === "DELIVERED" ? "completed" :
             order?.status === "shipped" ? "completed" : "pending",
    },
    {
      id: 4,
      title: "Out for Delivery",
      date: tracking?.out_for_delivery_date ? formatDate(tracking.out_for_delivery_date) : "",
      icon: Truck,
      status: tracking?.current_status === "OUT FOR DELIVERY" || tracking?.current_status === "DELIVERED" ? "completed" :
             tracking?.current_status === "IN TRANSIT" ? "in-progress" : "pending",
    },
    {
      id: 5,
      title: "Delivered",
      date: tracking?.delivered_date ? formatDate(tracking.delivered_date) : "",
      icon: Home,
      status: tracking?.current_status === "DELIVERED" || order?.status === "delivered" || order?.status === "completed" ? "completed" : "pending",
    },
  ];

  return steps;
};

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        // Fetch order details
        const orderData = await orderService.getById(id);
        setOrder(orderData);

        // Try to fetch tracking info if shipment exists
        if (orderData.shiprocket?.shipmentId) {
          try {
            const trackingData = await orderService.trackOrder(id);
            setTracking(trackingData);
          } catch (trackErr) {
            console.log("Tracking not available yet");
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#731162]"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center pt-24">
        <p className="text-red-500 mb-4">{error || "Order not found"}</p>
        <button
          onClick={() => navigate("/orders")}
          className="text-[#731162] flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>
      </div>
    );
  }

  const steps = getStatusSteps(order, tracking);

  return (
    <div className="min-h-screen bg-base p-6 pt-28">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate("/orders")}
          className="mb-6 text-[#731162] flex items-center gap-2 hover:underline"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>

        <h2 className="mb-8 text-2xl font-bold">Order Tracking</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Timeline Section */}
          <div className="md:col-span-2 rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-6 text-lg font-semibold">Shipment Progress</h3>

            <div className="relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;

                return (
                  <div key={step.id} className="flex gap-4 pb-8 last:pb-0">
                    {/* Line and Circle */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.status === "completed"
                            ? "bg-green-500"
                            : step.status === "in-progress"
                            ? "bg-[#FC6CB4]"
                            : "bg-gray-200"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            step.status === "completed" || step.status === "in-progress"
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 min-h-[40px] ${
                            step.status === "completed" ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <p
                        className={`font-medium ${
                          step.status === "completed"
                            ? "text-green-600"
                            : step.status === "in-progress"
                            ? "text-[#FC6CB4]"
                            : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                      {step.date && (
                        <p className="text-sm text-gray-500">{step.date}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tracking Info */}
            {tracking?.awb && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <span className="text-gray-500">AWB Number:</span>{" "}
                  <span className="font-medium">{tracking.awb}</span>
                </p>
                {tracking.courier_name && (
                  <p className="text-sm mt-1">
                    <span className="text-gray-500">Courier:</span>{" "}
                    <span className="font-medium">{tracking.courier_name}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="h-fit rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-medium">#{order.orderId || order._id?.slice(-6)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-medium capitalize ${
                  order.status === "delivered" || order.status === "completed"
                    ? "text-green-600"
                    : order.status === "cancelled" || order.status === "failed"
                    ? "text-red-600"
                    : "text-[#FC6CB4]"
                }`}>
                  {order.status?.replace(/_/g, " ")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Items</span>
                <span className="font-medium">{order.products?.length || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>
                <span className={`font-medium ${
                  order.status === "pending payment"
                    ? "text-red-500"
                    : order.paymentMethod === "cashOnDelivery"
                    ? "text-orange-600"
                    : "text-green-600"
                }`}>
                  {order.status === "pending payment"
                    ? "Payment Pending"
                    : order.paymentMethod === "cashOnDelivery"
                    ? "COD"
                    : "Paid Online"}
                </span>
              </div>

              <div className="border-t pt-3">
                <p className="text-gray-500 mb-1">Products:</p>
                {order.products?.map((item, idx) => (
                  <p key={idx} className="text-sm">
                    {item.name} × {item.quantity}
                  </p>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
