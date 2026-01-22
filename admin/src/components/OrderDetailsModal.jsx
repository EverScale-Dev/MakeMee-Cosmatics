import { useState } from "react";
import { orderService, shiprocketService } from "../services";

const validStatuses = [
  "pending payment",
  "processing",
  "on hold",
  "completed",
  "refunded",
  "cancelled",
  "failed"
];

export default function OrderDetailsModal({ order, onClose, onRefresh }) {
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const [shipmentLoading, setShipmentLoading] = useState(false);
  const [awbLoading, setAwbLoading] = useState(false);

  if (!order) return null;

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      await orderService.updateStatus(order._id, status);
      alert("Status updated successfully");
      onRefresh?.();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async () => {
    setShipmentLoading(true);
    try {
      const result = await shiprocketService.createShipment(order._id);
      if (result.success || result.alreadyExists) {
        alert(result.message || "Shipment created successfully");
        onRefresh?.();
        onClose();
      } else {
        alert(result.error || "Failed to create shipment");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create shipment");
    } finally {
      setShipmentLoading(false);
    }
  };

  const handleRetryAwb = async () => {
    setAwbLoading(true);
    try {
      const result = await shiprocketService.assignAwb(order._id);
      if (result.success || result.alreadyExists) {
        alert("AWB assigned successfully");
        onRefresh?.();
        onClose();
      } else {
        alert(result.error || "Failed to assign AWB");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to assign AWB");
    } finally {
      setAwbLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      // Use numeric orderId, not MongoDB _id
      await orderService.downloadInvoice(order.orderId);
    } catch (error) {
      console.error("Download invoice error:", error);
      alert("Failed to download invoice");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const customer = order.customer;
  const address = customer?.shippingAddress;
  const shiprocket = order.shiprocket;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center overflow-auto p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Order Details: #{order.orderId}
          </h2>
          <button onClick={onClose} className="text-xl hover:text-red-500">✕</button>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Customer & Shipping</h3>
            <p><b>Name:</b> {customer?.fullName || "N/A"}</p>
            <p><b>Email:</b> {customer?.email || "N/A"}</p>
            <p><b>Phone:</b> {customer?.phone || "N/A"}</p>
            {address && (
              <div className="mt-2 text-sm text-gray-600">
                <p>{address.apartment_address}</p>
                <p>{address.street_address1}</p>
                {address.street_address2 && <p>{address.street_address2}</p>}
                <p>{address.city}, {address.state} - {address.pincode}</p>
              </div>
            )}
          </div>

          {/* Shipment */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Shipment Details</h3>
            {shiprocket?.shipmentId ? (
              <>
                <p><b>Shiprocket ID:</b> {shiprocket.shipmentId}</p>
                <p><b>AWB:</b> {shiprocket.awb || <span className="text-yellow-600">Pending</span>}</p>
                <p><b>Courier:</b> {shiprocket.courierName || "N/A"}</p>
                <p><b>Status:</b> {shiprocket.shipmentStatus || shiprocket.status || "N/A"}</p>

                {shiprocket.awbError && (
                  <p className="mt-2 text-sm text-red-600">
                    <b>Error:</b> {shiprocket.awbError}
                  </p>
                )}

                <div className="flex gap-2 mt-3 flex-wrap">
                  {shiprocket.trackingUrl && (
                    <a
                      href={shiprocket.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border px-3 py-1 text-sm rounded hover:bg-gray-50"
                    >
                      Track Shipment
                    </a>
                  )}
                  {shiprocket.labelUrl && (
                    <a
                      href={shiprocket.labelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border px-3 py-1 text-sm rounded hover:bg-gray-50"
                    >
                      Print Label
                    </a>
                  )}
                  {!shiprocket.awb && (
                    <button
                      onClick={handleRetryAwb}
                      disabled={awbLoading}
                      className="bg-yellow-500 text-white px-3 py-1 text-sm rounded disabled:opacity-50"
                    >
                      {awbLoading ? "Retrying..." : "Retry AWB"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-gray-400">
                <p>No shipment created yet</p>
                {order.status !== "pending payment" && (
                  <button
                    onClick={handleCreateShipment}
                    disabled={shipmentLoading}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 text-sm rounded disabled:opacity-50"
                  >
                    {shipmentLoading ? "Creating..." : "Create Shipment"}
                  </button>
                )}
                {order.status === "pending payment" && (
                  <p className="mt-2 text-sm text-orange-600">
                    Cannot create shipment for unpaid orders
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Management & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Order Management</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              {validStatuses.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleStatusUpdate}
                disabled={loading || status === order.status}
                className="flex-1 bg-purple-600 text-white py-2 rounded text-sm disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Status"}
              </button>
              <button
                onClick={handleDownloadInvoice}
                className="flex-1 bg-gray-600 text-white py-2 rounded text-sm"
              >
                Download Invoice
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <p><b>Order Date:</b> {formatDate(order.createdAt)}</p>
            <p><b>Payment Method:</b> {order.paymentMethod === "cashOnDelivery" ? "Cash on Delivery" : "Online Payment"}</p>
            <div className="mt-2 pt-2 border-t">
              <p>Subtotal: {formatCurrency(order.subtotal)}</p>
              <p>Delivery: {formatCurrency(order.deliveryCharge)}</p>
              <p className="mt-2 font-semibold text-blue-600 text-lg">
                Total: {formatCurrency(order.totalAmount)}
              </p>
            </div>
            {order.note && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-sm text-gray-600"><b>Note:</b> {order.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="font-semibold mb-2">Order Items</h3>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-center">Price</th>
                <th className="p-2 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.products?.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-center">{formatCurrency(item.price)}</td>
                  <td className="p-2 text-center">{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
