import { useState } from "react";
import { Search } from "lucide-react";

const customersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    totalOrders: 12,
    totalSpent: 820,
    status: "Active"
  },
  {
    id: 2,
    name: "Emma Stone",
    email: "emma@example.com",
    phone: "+91 9123456780",
    totalOrders: 5,
    totalSpent: 310,
    status: "Inactive"
  },
  {
    id: 3,
    name: "Michael Scott",
    email: "michael@dundermifflin.com",
    phone: "+91 9988776655",
    totalOrders: 18,
    totalSpent: 1240,
    status: "Active"
  },
  {
    id: 4,
    name: "Sarah Lee",
    email: "sarah@example.com",
    phone: "+91 9090909090",
    totalOrders: 9,
    totalSpent: 560,
    status: "Active"
  },
  {
    id: 5,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+91 9876501234",
    totalOrders: 7,
    totalSpent: 450,
    status: "Inactive"
  },
  {
    id: 6,
    name: "Bob Brown",
    email: "bob@example.com",
    phone: "+91 9123409876",
    totalOrders: 11,
    totalSpent: 780,
    status: "Active"
  },
   {
    id: 7,
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    totalOrders: 12,
    totalSpent: 820,
    status: "Active"
  },
  {
    id: 8,
    name: "Emma Stone",
    email: "emma@example.com",
    phone: "+91 9123456780",
    totalOrders: 5,
    totalSpent: 310,
    status: "Inactive"
  },
  {
    id: 9,
    name: "Michael Scott",
    email: "michael@dundermifflin.com",
    phone: "+91 9988776655",
    totalOrders: 18,
    totalSpent: 1240,
    status: "Active"
  },
  {
    id: 10,
    name: "Sarah Lee",
    email: "sarah@example.com",
    phone: "+91 9090909090",
    totalOrders: 9,
    totalSpent: 560,
    status: "Active"
  },
  // add more dummy users to see pagination
];

const statusBadge = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-700"
};

const ITEMS_PER_PAGE = 6;

export default function Customers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // FILTER
  const filteredCustomers = customersData.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // PAGINATION LOGIC
  const totalPages = Math.ceil(
    filteredCustomers.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // reset page when filter changes
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatus = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl font-semibold">Customers</h1>

        <div className="flex gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={handleSearch}
              className="pl-9 pr-4 py-2 text-sm border rounded-md w-56"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={handleStatus}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left p-4">Customer</th>
              <th>Contact</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-medium">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-gray-500">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="text-center text-gray-600">
                  {customer.phone}
                </td>

                <td className="text-center font-medium">
                  {customer.totalOrders}
                </td>

                <td className="text-center font-medium">
                  ${customer.totalSpent}
                </td>

                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge[customer.status]}`}
                  >
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}

            {paginatedCustomers.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-400"
                >
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? "bg-black text-white"
                    : ""
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
