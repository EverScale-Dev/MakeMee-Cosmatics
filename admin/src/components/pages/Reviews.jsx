import { useState, useEffect } from "react";
import { Search, Star, Check, Trash2 } from "lucide-react";
import { reviewService } from "../../services";

const statusBadge = {
  true: "bg-green-100 text-green-700",
  false: "bg-yellow-100 text-yellow-700"
};

const ITEMS_PER_PAGE = 10;

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAll();
      setReviews(data.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await reviewService.approve(id);
      fetchReviews();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    setActionLoading(id);
    try {
      await reviewService.delete(id);
      fetchReviews();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete review");
    } finally {
      setActionLoading(null);
    }
  };

  // FILTERING
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.name?.toLowerCase().includes(search.toLowerCase()) ||
      review.productId?.toLowerCase().includes(search.toLowerCase());

    const matchesRating =
      ratingFilter === "All" || review.rating === Number(ratingFilter);

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Approved" && review.isApproved) ||
      (statusFilter === "Pending" && !review.isApproved);

    return matchesSearch && matchesRating && matchesStatus;
  });

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleRating = (e) => {
    setRatingFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatus = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
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
        <h1 className="text-xl font-semibold">Reviews ({reviews.length})</h1>

        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={handleSearch}
              className="pl-9 pr-4 py-2 text-sm border rounded-md w-48"
            />
          </div>

          {/* Rating filter */}
          <select
            value={ratingFilter}
            onChange={handleRating}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={handleStatus}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="All">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left p-4">Customer</th>
              <th>Rating</th>
              <th className="text-left">Review</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedReviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No reviews found
                </td>
              </tr>
            ) : (
              paginatedReviews.map((review) => (
                <tr
                  key={review._id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-medium">
                        {review.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-medium">{review.name}</p>
                      </div>
                    </div>
                  </td>

                  <td className="text-center">
                    <div className="flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </td>

                  <td className="max-w-xs px-4 text-gray-600">
                    <p className="line-clamp-2">{review.message}</p>
                  </td>

                  <td className="text-center text-gray-500">
                    {formatDate(review.createdAt)}
                  </td>

                  <td className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusBadge[review.isApproved]
                      }`}
                    >
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      {!review.isApproved && (
                        <button
                          onClick={() => handleApprove(review._id)}
                          disabled={actionLoading === review._id}
                          className="text-green-600 hover:text-green-800 disabled:opacity-50"
                          title="Approve"
                        >
                          {actionLoading === review._id ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <Check size={18} />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={actionLoading === review._id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
