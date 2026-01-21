const orders = [
  {
    id: "#ORD-1001",
    customer: "John Doe",
    product: "Skin Care Kit",
    amount: "$120",
    status: "Completed"
  },
  {
    id: "#ORD-1002",
    customer: "Emma Stone",
    product: "Face Serum",
    amount: "$80",
    status: "Pending"
  },
  {
    id: "#ORD-1003",
    customer: "Michael Scott",
    product: "Body Lotion",
    amount: "$60",
    status: "Cancelled"
  }
];

const statusStyles = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700"
};

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Recent Orders</h3>

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
              <tr key={order.id} className="border-b last:border-none">
                <td className="py-3">{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td className="text-center">{order.amount}</td>
                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}
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
            key={order.id}
            className="border rounded-lg p-4 space-y-1"
          >
            <div className="flex justify-between">
              <span className="font-medium">{order.product}</span>
              <span className="text-sm">{order.amount}</span>
            </div>
            <p className="text-sm text-gray-500">{order.customer}</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
