import { useEffect, useState } from "react";
import OrderDetailsModal from "../OrderDetailsModal";
import { orderService, shiprocketService } from "../../services";

const statusStyle = {
  "pending payment": "bg-yellow-100 text-yellow-700",
  "processing": "bg-blue-100 text-blue-700",
  "on hold": "bg-orange-100 text-orange-700",
  "completed": "bg-green-100 text-green-700",
  "refunded": "bg-purple-100 text-purple-700",
  "cancelled": "bg-red-100 text-red-700",
  "failed": "bg-red-100 text-red-700",
  "shipped": "bg-indigo-100 text-indigo-700",
  "delivered": "bg-green-100 text-green-700"
};

const ITEMS_PER_PAGE = 10;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    fromDate: "",
    toDate: "",
    status: ""
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll(currentPage, ITEMS_PER_PAGE);
      setOrders(data.orders || []);
      setTotalOrders(data.totalOrders || 0);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Client-side filtering
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const customerName = order.customer?.fullName || "";

    if (filters.name && !customerName.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    if (filters.minPrice && order.totalAmount < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && order.totalAmount > Number(filters.maxPrice)) {
      return false;
    }
    if (filters.fromDate && orderDate < new Date(filters.fromDate)) {
      return false;
    }
    if (filters.toDate && orderDate > new Date(filters.toDate)) {
      return false;
    }
    if (filters.status && order.status !== filters.status) {
      return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(totalOrders / ITEMS_PER_PAGE));

  const clearFilters = () => {
    setFilters({
      name: "",
      minPrice: "",
      maxPrice: "",
      fromDate: "",
      toDate: "",
      status: ""
    });
  };

  const handleCreateShipment = async (orderId) => {
    setActionLoading(orderId);
    try {
      const result = await shiprocketService.createShipment(orderId);
      if (result.success || result.alreadyExists) {
        alert(result.message || "Shipment created successfully");
        fetchOrders();
      } else {
        alert(result.error || "Failed to create shipment");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create shipment");
    } finally {
      setActionLoading(null);
    }
  };

  // Sync shipment status from Shiprocket
  const handleSyncStatus = async (orderId) => {
    setActionLoading(orderId);
    try {
      const result = await shiprocketService.trackOrder(orderId);
      if (result.success) {
        alert(`Status synced: ${result.currentStatus || result.orderStatus}`);
        fetchOrders();
      } else {
        alert("Failed to sync status");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to sync status");
    } finally {
      setActionLoading(null);
    }
  };

  // Check if shipment can be created for an order
  const canCreateShipment = (order) => {
    // COD orders can always be shipped (payment on delivery)
    if (order.paymentMethod === "cashOnDelivery") {
      return true;
    }
    // Online payment orders need payment verified (not pending payment)
    return order.status !== "pending payment";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders ({totalOrders})</h1>
        <button
          onClick={() => setShowFilter(true)}
          className="px-4 py-2 text-sm bg-black text-white rounded-md"
        >
          Filter
        </button>
      </div>

      {/* Filter Popup */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setShowFilter(false)}>✕</button>
            </div>

            {/* Customer */}
            <div>
              <label className="text-sm font-medium">Customer Name</label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              >
                <option value="">All</option>
                <option value="pending payment">Pending Payment</option>
                <option value="processing">Processing</option>
                <option value="on hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="border rounded-md px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Date */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                className="border rounded-md px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                className="border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={clearFilters}
                className="flex-1 border rounded-md py-2 text-sm"
              >
                Clear
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="flex-1 bg-black text-white rounded-md py-2 text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left p-4">Order ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th className="text-center">Date</th>
              <th className="text-center">Amount</th>
              <th className="text-center">Payment</th>
              <th className="text-center">Status</th>
              <th className="text-center">Shipment</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-8 text-center text-gray-400">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">#{order.orderId}</td>
                  <td className="text-center">{order.customer?.fullName || "N/A"}</td>
                  <td className="text-center max-w-[150px] truncate">
                    {order.products?.map(p => p.name).join(", ") || "N/A"}
                  </td>
                  <td className="text-center">{formatDate(order.createdAt)}</td>
                  <td className="text-center">{formatCurrency(order.totalAmount)}</td>
                  <td className="text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === "pending payment"
                        ? "bg-red-100 text-red-700"
                        : order.paymentMethod === "cashOnDelivery"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {order.status === "pending payment"
                        ? "Pending"
                        : order.paymentMethod === "cashOnDelivery"
                        ? "COD"
                        : "Paid"}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      statusStyle[order.status] || "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-center">
                    {order.shiprocket?.shipmentId ? (
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.shiprocket.awb
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.shiprocket.awb ? "Ready" : "Pending AWB"}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Not created</span>
                    )}
                  </td>
                  <td className="text-center space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800 text-lg"
                      title="View Order"
                    >
                      👁️
                    </button>
                    {!order.shiprocket?.shipmentId ? (
                      <button
                        onClick={() => handleCreateShipment(order._id)}
                        disabled={actionLoading === order._id || !canCreateShipment(order)}
                        className="text-lg disabled:opacity-50"
                        title={!canCreateShipment(order) ? "Online payment pending" : "Create Shipment"}
                      >
                        {actionLoading === order._id ? "⏳" : "🚚"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSyncStatus(order._id)}
                        disabled={actionLoading === order._id}
                        className="text-lg disabled:opacity-50"
                        title="Sync Shiprocket Status"
                      >
                        {actionLoading === order._id ? "⏳" : "🔄"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {(() => {
            // Show pages around current page
            const pages = [];
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, currentPage + 2);

            // Adjust if near start or end
            if (currentPage <= 3) {
              end = Math.min(5, totalPages);
            } else if (currentPage >= totalPages - 2) {
              start = Math.max(1, totalPages - 4);
            }

            for (let p = start; p <= end; p++) {
              pages.push(p);
            }
            return pages.map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page ? "bg-black text-white" : ""
                }`}
              >
                {page}
              </button>
            ));
          })()}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefresh={fetchOrders}
        />
      )}
    </div>
  );
}
