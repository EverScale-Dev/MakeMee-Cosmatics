export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center overflow-auto">
      <div className="bg-white w-full max-w-4xl rounded-xl p-6 space-y-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Order Details: {order.id}
          </h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Customer */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Customer & Shipping</h3>
            <p><b>Name:</b> {order.customer}</p>
            <p><b>Email:</b> demo@gmail.com</p>
            <p><b>Phone:</b> 9999999999</p>
            <p className="mt-2 text-sm text-gray-600">
              Main Gate, City, State - 400001
            </p>
          </div>

          {/* Shipment */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Shipment Details</h3>
            <p>Shiprocket ID: N/A</p>
            <p>AWB / Tracking: N/A</p>
            <p>Courier: N/A</p>

            <div className="flex gap-2 mt-3">
              <button className="border px-3 py-1 text-sm rounded" disabled>
                View Live Tracking
              </button>
              <button className="border px-3 py-1 text-sm rounded" disabled>
                Print Label
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Order Management</h3>
            <select className="w-full border rounded-md px-3 py-2 text-sm">
              <option>Pending Payment</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-purple-600 text-white py-2 rounded text-sm">
                Save Status
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 rounded text-sm">
                Create Shipment
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <p>Subtotal: ₹ {order.amount}</p>
            <p>Shipping: ₹ 0</p>
            <p className="mt-2 font-semibold text-blue-600">
              Total Payable: ₹ {order.amount}
            </p>
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
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2">{order.product}</td>
                <td className="p-2 text-center">1</td>
                <td className="p-2 text-center">₹ {order.amount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
