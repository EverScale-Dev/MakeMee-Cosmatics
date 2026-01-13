import Modal from "../Modal";

export default function OrderDetailsModal({ order, onClose }) {
  return (
    <Modal title={`Order #${order.id}`} onClose={onClose}>
      <div className="space-y-3 text-sm">
        <Detail label="Product" value={order.product} />
        <Detail label="Quantity" value={order.quantity} />
        <Detail label="Amount Paid" value={`₹${order.amount}`} />
        <Detail label="Payment Method" value={order.payment} />
        <Detail label="Order Status" value={order.status} />
        <Detail label="Order Date" value={order.date} />
      </div>

      <button
        onClick={onClose}
        className="w-full bg-black text-white py-2 rounded-lg mt-4"
      >
        Close
      </button>
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
