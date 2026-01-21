export default function OrderStatusBadge({ status }) {
  const styles = {
    Delivered: "bg-green-100 text-green-700",
    Shipped: "bg-blue-100 text-blue-700",
    Placed: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${
        styles[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}
