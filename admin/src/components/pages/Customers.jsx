import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { customerService } from "../../services";

const ITEMS_PER_PAGE = 10;

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getAll(currentPage, ITEMS_PER_PAGE);
      setCustomers(data.customers || []);
      setTotalCustomers(data.totalCustomers || 0);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  // Client-side search filter
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search);
    return matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(totalCustomers / ITEMS_PER_PAGE));

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl font-semibold">Customers ({totalCustomers})</h1>

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
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left p-4">Customer</th>
              <th>Phone</th>
              <th>City</th>
              <th>State</th>
              <th>Pincode</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr
                  key={customer._id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-medium">
                        {customer.fullName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-medium">{customer.fullName}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="text-center text-gray-600">
                    {customer.phone || "N/A"}
                  </td>

                  <td className="text-center">
                    {customer.shippingAddress?.city || "N/A"}
                  </td>

                  <td className="text-center">
                    {customer.shippingAddress?.state || "N/A"}
                  </td>

                  <td className="text-center">
                    {customer.shippingAddress?.pincode || "N/A"}
                  </td>

                  <td className="text-center text-gray-500">
                    {formatDate(customer.createdAt)}
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
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {(() => {
            // Show pages around current page
            const maxButtons = 5;
            let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
            let end = Math.min(totalPages, start + maxButtons - 1);
            if (end - start + 1 < maxButtons) {
              start = Math.max(1, end - maxButtons + 1);
            }
            const pages = [];
            for (let i = start; i <= end; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i ? "bg-black text-white" : ""
                  }`}
                >
                  {i}
                </button>
              );
            }
            return pages;
          })()}

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
