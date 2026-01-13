"use client";
import { useEffect, useState, useMemo } from "react";
import ReviewModal from "./ReviewForm";
import ReviewsOutlinedIcon from "@mui/icons-material/ReviewsOutlined";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3); // show 3 initially

  const loadReviews = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/review/${productId}`
    );
    const data = await res.json();
    if (res.ok) setReviews(data.data);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const averageRating =
    reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
      (reviews.length || 1) || 0;

  const getCount = (star) =>
    reviews.filter((r) => Number(r.rating) === star).length;

  // ⭐ Visible reviews with pagination
  const visibleReviews = reviews.slice(0, visibleCount);

  // ⭐ Generate consistent random avatar color per user
  const avatarColors = useMemo(() => {
    const colors = [
      "bg-red-200 text-red-800",
      "bg-blue-200 text-blue-800",
      "bg-yellow-200 text-yellow-800",
      "bg-green-200 text-green-800",
      "bg-purple-200 text-purple-800",
      "bg-pink-200 text-pink-800",
      "bg-indigo-200 text-indigo-800",
      "bg-teal-200 text-teal-800",
    ];

    const map = {};
    reviews.forEach((r, index) => {
      map[r._id] = colors[index % colors.length];
    });

    return map;
  }, [reviews]);

  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow-lg border border-gray-100">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
        <ReviewsOutlinedIcon className="text-yellow-600" />
        Customer Ratings
        </h2>

        <button
          onClick={() => setModalOpen(true)}
            className="px-5 py-2 rounded-lg border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 transition font-medium shadow-sm"
        >
          Rate Product
        </button>
      </div>

      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/4 text-center bg-gray-50 p-5 rounded-xl shadow-inner">
          <p className="text-5xl font-bold">{averageRating.toFixed(1)}</p>
          <p className="text-yellow-500 text-2xl mt-1">
            {"★".repeat(Math.round(averageRating))}
          </p>
          <p className="text-gray-500 text-sm mt-2">{reviews.length} Ratings</p>
        </div>

        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const percentage =
              (getCount(star) / (reviews.length || 1)) * 100;

            return (
              <div key={star} className="flex items-center gap-4 mb-3">
                <div className="w-10 text-sm font-medium">{star} ★</div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-8 text-right text-gray-600 text-sm">
                  {getCount(star)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      {/* Reviews */}
      <div className="space-y-6">
        {visibleReviews.map((r) => (
          <div
            key={r._id}
            className="p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start gap-4">

              {/* Avatar with unique color */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold shadow-sm ${avatarColors[r._id]}`}
              >
                {r.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-lg">{r.name}</p>

                <div className="flex items-center gap-2 mt-1">
                  <p className="text-yellow-500 text-base">
                    {"★".repeat(r.rating)}
                  </p>
                  <span className="text-green-600 text-xs font-medium px-2 py-1 bg-green-100 rounded-full">
                    Verified User
                  </span>
                </div>

                <p className="text-gray-700 mt-3 leading-relaxed">
                  {r.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button – 5 at a time */}
      {visibleCount < reviews.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisibleCount((c) => c + 5)}
            className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-medium"
          >
            Load More Reviews
          </button>
        </div>
      )}

      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        productId={productId}
        onSuccess={loadReviews}
      />
    </div>
  );
}
