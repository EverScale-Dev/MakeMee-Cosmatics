import { useState, useEffect } from "react";
import { Package, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderCard from "./OrderCard";
import OrderDetailsModal from "./OrderDetailsModal";
import { orderService } from "@/services";

export default function OrdersSection() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        // Transform to expected format and take only recent 5
        const transformed = data.slice(0, 5).map(order => ({
          id: order.orderId || order._id,
          _id: order._id,
          product: order.products?.[0]?.name || "Order",
          amount: order.totalAmount || 0,
          status: order.status || "pending",
          quantity: order.products?.reduce((sum, p) => sum + (p.quantity || 1), 0) || 1,
          date: new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          payment: order.paymentMethod === 'cashOnDelivery' ? 'COD' : 'Online',
          products: order.products,
        }));
        setOrders(transformed);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      <div className="max-h-80 pb-4 overflow-y-auto space-y-3 pr-1">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#731162]"></div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No orders yet</p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              data={order}
              onView={() => setSelectedOrder(order)}
            />
          ))
        )}
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

