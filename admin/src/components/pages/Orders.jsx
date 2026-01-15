import { useEffect, useState } from "react";

const ordersData = [
  {
    id: "ORD-1001",
    customer: "John Doe",
    product: "Skin Care Kit",
    amount: 120,
    status: "Completed",
    date: "2024-01-05"
  },
  {
    id: "ORD-1002",
    customer: "Emma Stone",
    product: "Face Serum",
    amount: 80,
    status: "Pending",
    date: "2024-01-12"
  },
  {
    id: "ORD-1003",
    customer: "Michael Scott",
    product: "Body Lotion",
    amount: 60,
    status: "Cancelled",
    date: "2024-01-18"
  },
  {
    id: "ORD-1004",
    customer: "Sarah Lee",
    product: "Hair Oil",
    amount: 45,
    status: "Completed",
    date: "2024-01-22"
  },
  {
    id: "ORD-1005",
    customer: "John Doe",
    product: "Skin Care Kit",
    amount: 120,
    status: "Completed",
    date: "2024-01-05"
  },
  {
    id: "ORD-1006",
    customer: "Emma Stone",
    product: "Face Serum",
    amount: 80,
    status: "Pending",
    date: "2024-01-12"
  },
  {
    id: "ORD-1007",
    customer: "Michael Scott",
    product: "Body Lotion",
    amount: 60,
    status: "Cancelled",
    date: "2024-01-18"
  },
  {
    id: "ORD-1008",
    customer: "Sarah Lee",
    product: "Hair Oil",
    amount: 45,
    status: "Completed",
    date: "2024-01-22"
  }
  // assume many more orders
];

const statusStyle = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700"
};

const ITEMS_PER_PAGE = 6;

export default function Orders() {
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    fromDate: "",
    toDate: ""
  });

  /* ---------------- RESET PAGE ON FILTER CHANGE ---------------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  /* ---------------- FILTERING ---------------- */
  const filteredOrders = ordersData.filter((order) => {
    const orderDate = new Date(order.date);

    if (
      filters.name &&
      !order.customer.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      return false;
    }

    if (filters.minPrice && order.amount < Number(filters.minPrice)) {
      return false;
    }

    if (filters.maxPrice && order.amount > Number(filters.maxPrice)) {
      return false;
    }

    if (filters.fromDate && orderDate < new Date(filters.fromDate)) {
      return false;
    }

    if (filters.toDate && orderDate > new Date(filters.toDate)) {
      return false;
    }

    return true;
  });

  /* ---------------- PAGINATION (FIXED) ---------------- */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedOrders = filteredOrders.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setFilters({
      name: "",
      minPrice: "",
      maxPrice: "",
      fromDate: "",
      toDate: ""
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders</h1>

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
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                className="border rounded-md px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                className="border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Date */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters({ ...filters, fromDate: e.target.value })
                }
                className="border rounded-md px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) =>
                  setFilters({ ...filters, toDate: e.target.value })
                }
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
              <th>Product</th>
              <th className="text-center">Date</th>
              <th className="text-center">Amount</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td className="text-center">{order.date}</td>
                <td className="text-center">${order.amount}</td>
                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}

            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between p-4">
            <p className="text-sm text-gray-500">
              Page {safeCurrentPage} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage(safeCurrentPage - 1)}
                className="px-3 py-1 text-sm border rounded disabled:opacity-40"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 text-sm border rounded ${
                    safeCurrentPage === i + 1
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage(safeCurrentPage + 1)}
                className="px-3 py-1 text-sm border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
