import { useState } from "react";
import { Search, Star } from "lucide-react";

const reviewsData = [
  {
    id: 1,
    customer: "John Doe",
    email: "john@example.com",
    product: "Skin Care Kit",
    rating: 5,
    comment:
      "Amazing quality, visible results within a week. Highly recommended!",
    date: "2024-01-12",
    status: "Approved"
  },
  {
    id: 2,
    customer: "Emma Stone",
    email: "emma@example.com",
    product: "Face Serum",
    rating: 4,
    comment:
      "Very good product, but the fragrance could be improved.",
    date: "2024-01-18",
    status: "Pending"
  },
  {
    id: 3,
    customer: "Michael Scott",
    email: "michael@dundermifflin.com",
    product: "Body Lotion",
    rating: 2,
    comment:
      "Did not suit my skin type. Caused irritation after two uses.",
    date: "2024-01-20",
    status: "Approved"
  },
  {
    id: 4,
    customer: "Sarah Lee",
    email: "sarah@example.com",
    product: "Hair Oil",
    rating: 5,
    comment:
      "Excellent oil. Hair feels healthier and shinier.",
    date: "2024-01-24",
    status: "Approved"
  }
];

const statusBadge = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Rejected: "bg-red-100 text-red-700"
};

const ITEMS_PER_PAGE = 6;

export default function Reviews() {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [reviewKeyword, setReviewKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // FILTERING
  const filteredReviews = reviewsData.filter((review) => {
    const matchesSearch =
      review.customer.toLowerCase().includes(search.toLowerCase()) ||
      review.product.toLowerCase().includes(search.toLowerCase());

    const matchesRating =
      ratingFilter === "All" ||
      review.rating === Number(ratingFilter);

    const matchesReviewText =
      !reviewKeyword ||
      review.comment
        .toLowerCase()
        .includes(reviewKeyword.toLowerCase());

    return matchesSearch && matchesRating && matchesReviewText;
  });

  // PAGINATION
  const totalPages = Math.ceil(
    filteredReviews.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Reset page on filter change
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleKeyword = (e) => {
    setReviewKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleRating = (e) => {
    setRatingFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl font-semibold">Reviews</h1>

        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer or product..."
              value={search}
              onChange={handleSearch}
              className="pl-9 pr-4 py-2 text-sm border rounded-md w-56"
            />
          </div>

          {/* Review keyword */}
          <input
            type="text"
            placeholder="Search inside reviews..."
            value={reviewKeyword}
            onChange={handleKeyword}
            className="px-4 py-2 text-sm border rounded-md w-56"
          />

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
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left p-4">Customer</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedReviews.map((review) => (
              <tr
                key={review.id}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-medium">
                      {review.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{review.customer}</p>
                      <p className="text-xs text-gray-500">
                        {review.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="text-center font-medium">
                  {review.product}
                </td>

                <td className="text-center">
                  <div className="flex justify-center gap-1">
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
                  <p className="line-clamp-2">{review.comment}</p>
                </td>

                <td className="text-center text-gray-500">
                  {review.date}
                </td>

                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge[review.status]}`}
                  >
                    {review.status}
                  </span>
                </td>
              </tr>
            ))}

            {paginatedReviews.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-400"
                >
                  No reviews found
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
