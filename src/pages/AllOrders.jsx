import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, SlidersHorizontal, Loader2, Package } from "lucide-react";
import { orderService } from "@/services";
import { useAuth } from "@/context/AuthContext";

const statusStyles = {
  "pending payment": "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  "on hold": "bg-orange-100 text-orange-800",
  shipped: "bg-purple-100 text-purple-800",
  "in transit": "bg-indigo-100 text-indigo-800",
  "out for delivery": "bg-cyan-100 text-cyan-800",
  delivered: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  refunded: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function AllOrders() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("all");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login?redirect=/orders");
    }
  }, [isLoggedIn, navigate]);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn) return;

      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        // Transform to expected format
        const transformed = (data.orders || data).map((order) => ({
          id: order.orderId,
          _id: order._id,
          date: order.createdAt,
          status: order.status || "pending payment",
          amount: order.totalAmount || 0,
          items: order.products?.reduce((sum, p) => sum + (p.quantity || 1), 0) || 0,
          products: order.products,
          paymentMethod: order.paymentMethod,
          customer: order.customer,
        }));
        setOrders(transformed);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFilteredOrders = () => {
    if (range === "all") return orders;

    const now = new Date();
    const past = new Date();

    if (range === "3m") past.setMonth(now.getMonth() - 3);
    if (range === "6m") past.setMonth(now.getMonth() - 6);

    return orders.filter((order) => {
      const d = new Date(order.date);
      return d >= past && d <= now;
    });
  };

  const filteredOrders = getFilteredOrders();

  const labelMap = {
    all: "All Orders",
    "3m": "Last 3 Months",
    "6m": "Last 6 Months",
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-10 mt-20 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-[#FC6CB4]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 mt-20">
      <div className="max-w-5xl mx-auto">
        {/* HEADER + FILTER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#731162]">My Orders</h1>

          <div className="relative" ref={dropdownRef}>
            {/* SELECTION BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-5 py-2 rounded-full
                border border-black/20 bg-white text-black
                hover:border-[#FC6CB4] transition"
            >
              <SlidersHorizontal size={16} className="text-[#731162]" />
              <span className="text-sm font-medium">{labelMap[range]}</span>
              <ChevronDown
                size={16}
                className={`transition ${open ? "rotate-180" : ""}`}
              />
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden z-50">
                {Object.entries(labelMap).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setRange(key);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition
                      ${
                        range === key
                          ? "bg-[#731162] text-white"
                          : "hover:bg-[#FC6CB4] hover:text-white text-black"
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ORDERS LIST */}
        <div className="space-y-4">
          {filteredOrders.length === 0 && (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto text-black/20 mb-4" />
              <p className="text-black/60 text-lg">No orders found</p>
              <button
                onClick={() => navigate("/shop")}
                className="mt-4 px-6 py-2 bg-[#FC6CB4] text-black rounded-full hover:bg-[#F0A400] transition"
              >
                Start Shopping
              </button>
            </div>
          )}

          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="border border-black/10 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition"
            >
              <div>
                <p className="text-sm text-black/60">Order ID</p>
                <p className="font-semibold">#{order.id}</p>
                <p className="text-sm text-black/60 mt-1">
                  {order.items} {order.items === 1 ? "item" : "items"} •{" "}
                  {new Date(order.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium capitalize ${
                    statusStyles[order.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-xs text-black/50">
                  {order.paymentMethod === "cashOnDelivery" ? "COD" : "Paid Online"}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-lg">{formatPrice(order.amount)}</p>
                </div>
                <button
                  onClick={() => navigate(`/order-success?orderId=${order._id}`)}
                  className="text-sm text-[#FC6CB4] hover:underline whitespace-nowrap"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
