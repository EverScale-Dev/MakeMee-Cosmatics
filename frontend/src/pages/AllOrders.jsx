import { useState, useRef, useEffect } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

const ordersData = [
  {
    id: "ORD-1001",
    date: "2025-01-02",
    status: "Delivered",
    amount: 2499,
    items: 2,
  },
  {
    id: "ORD-1002",
    date: "2024-11-15",
    status: "Processing",
    amount: 1599,
    items: 1,
  },
  {
    id: "ORD-1003",
    date: "2024-08-10",
    status: "Cancelled",
    amount: 999,
    items: 1,
  },
];

const statusStyles = {
  Delivered: "bg-[#F0A400] text-black",
  Processing: "bg-[#FC6CB4] text-white",
  Cancelled: "bg-black text-white",
};

export default function AllOrders() {
  const [range, setRange] = useState("all");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    if (range === "all") return ordersData;

    const now = new Date();
    const past = new Date();

    if (range === "3m") past.setMonth(now.getMonth() - 3);
    if (range === "6m") past.setMonth(now.getMonth() - 6);

    return ordersData.filter((order) => {
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

  return (
    <div className="min-h-screen bg-white px-4 py-10">
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
            <p className="text-center text-black/60">No orders found.</p>
          )}

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-black/10 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <p className="text-sm text-black/60">Order ID</p>
                <p className="font-semibold">{order.id}</p>
                <p className="text-sm text-black/60 mt-1">
                  {order.items} items • {order.date}
                </p>
              </div>

              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  statusStyles[order.status]
                }`}
              >
                {order.status}
              </span>

              <div className="text-right">
                <p className="font-semibold text-lg">₹{order.amount}</p>
                <button className="text-sm text-[#FC6CB4] hover:underline">
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
