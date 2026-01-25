import { useState } from "react";
import Modal from "../Modal";
import { orderService } from "@/services";

const statusSteps = [
  { key: "pending payment", label: "Order Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "in transit", label: "In Transit" },
  { key: "out for delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

const getStatusIndex = (status) => {
  if (status === "cancelled" || status === "refunded" || status === "failed") {
    return -1; // Special case
  }
  const idx = statusSteps.findIndex(s => s.key === status);
  return idx >= 0 ? idx : 0;
};

export default function OrderDetailsModal({ order, onClose }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadInvoice = async () => {
    setDownloading(true);
    try {
      // Use orderId if available, fallback to _id
      const id = order.orderId || order._id || order.id;
      await orderService.downloadInvoice(id);
    } catch (error) {
      console.error("Failed to download invoice:", error);
      alert("Failed to download invoice");
    } finally {
      setDownloading(false);
    }
  };

  const currentStatusIndex = getStatusIndex(order.status);
  const isCancelled = order.status === "cancelled" || order.status === "refunded" || order.status === "failed";

  return (
    <Modal title={`Order #${order.orderId || order.id}`} onClose={onClose}>
      <div className="space-y-4 text-sm max-h-[70vh] overflow-y-auto">
        {/* Order Timeline */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Order Status</h4>
          {isCancelled ? (
            <div className="flex items-center gap-2 text-red-600">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="font-medium capitalize">{order.status}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {statusSteps.map((step, idx) => (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div className={`w-4 h-4 rounded-full ${
                    idx <= currentStatusIndex ? "bg-green-500" : "bg-gray-300"
                  }`}></div>
                  <span className={`text-xs mt-1 text-center ${
                    idx <= currentStatusIndex ? "text-green-600 font-medium" : "text-gray-400"
                  }`}>
                    {step.label}
                  </span>
                  {idx < statusSteps.length - 1 && (
                    <div className={`absolute h-0.5 w-full ${
                      idx < currentStatusIndex ? "bg-green-500" : "bg-gray-300"
                    }`} style={{ top: "8px", left: "50%" }}></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="space-y-2">
          <Detail label="Order Date" value={order.date} />
          <Detail label="Payment Method" value={order.payment} />
          <Detail label="Total Amount" value={`₹${order.totalAmount || order.amount}`} />
        </div>

        {/* Products Table */}
        <div>
          <h4 className="font-medium mb-2">Items Ordered</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Product</th>
                  <th className="text-center p-2">Qty</th>
                  <th className="text-right p-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.products?.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{item.name}</td>
                    <td className="text-center p-2">{item.quantity}</td>
                    <td className="text-right p-2">₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Info */}
        {order.shiprocket?.awb && (
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium mb-2">Shipping Details</h4>
            <p className="text-gray-600">AWB: {order.shiprocket.awb}</p>
            <p className="text-gray-600">Courier: {order.shiprocket.courierName || "N/A"}</p>
            {order.shiprocket.trackingUrl && (
              <a
                href={order.shiprocket.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm mt-1 inline-block"
              >
                Track Shipment →
              </a>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleDownloadInvoice}
            disabled={downloading}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            {downloading ? "Downloading..." : "Download Invoice"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-black text-white py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
