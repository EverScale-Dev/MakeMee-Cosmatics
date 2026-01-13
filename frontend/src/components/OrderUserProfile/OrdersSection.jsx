import { useState } from "react";
import { Package, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderCard from "./OrderCard";
import OrderDetailsModal from "./OrderDetailsModal";

const mockOrders = [
  {
    id: "1023",
    product: "Premium Product",
    amount: 1999,
    status: "Delivered",
    quantity: 1,
    date: "12 Jan 2026",
    payment: "UPI",
  },
  {
    id: "1024",
    product: "Premium Product",
    amount: 1999,
    status: "Shipped",
    quantity: 1,
    date: "15 Jan 2026",
    payment: "COD",
  },
];

export default function OrdersSection() {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <Package size={18} /> Order History
        </h2>
        <button
          onClick={() => navigate("/orders")}
          className="text-sm text-blue-600 flex items-center gap-1"
        >
          View All <ArrowRight size={14} />
        </button>
      </div>

      {/* SCROLLABLE LIST */}
      <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
        {mockOrders.map((order) => (
          <OrderCard
            key={order.id}
            data={order}
            onView={() => setSelectedOrder(order)}
          />
        ))}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </section>
  );
}
