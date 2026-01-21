import { useState, useEffect } from "react";
import { orderService } from "../services";

const statusStyles = {
  "pending payment": "bg-yellow-100 text-yellow-700",
  "processing": "bg-blue-100 text-blue-700",
  "on hold": "bg-orange-100 text-orange-700",
  "completed": "bg-green-100 text-green-700",
  "refunded": "bg-purple-100 text-purple-700",
  "cancelled": "bg-red-100 text-red-700",
  "failed": "bg-red-100 text-red-700"
};

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAll(1, 5);
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="font-semibold mb-4">Recent Orders</h3>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Recent Orders</h3>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No orders yet</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b">
                <tr>
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left">Customer</th>
                  <th className="text-left">Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b last:border-none">
                    <td className="py-3">#{order.orderId}</td>
                    <td>{order.customer?.fullName || "N/A"}</td>
                    <td>{order.products?.[0]?.name || "N/A"}</td>
                    <td className="text-center">{formatCurrency(order.totalAmount)}</td>
                    <td className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          statusStyles[order.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg p-4 space-y-1"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{order.products?.[0]?.name || "N/A"}</span>
                  <span className="text-sm">{formatCurrency(order.totalAmount)}</span>
                </div>
                <p className="text-sm text-gray-500">{order.customer?.fullName || "N/A"}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    statusStyles[order.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
