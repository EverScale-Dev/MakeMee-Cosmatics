"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function ReviewModal({ open, onClose, productId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [form, setForm] = useState({
    name: "",
    message: "",
  });

  const submitReview = async () => {
    if (!rating) return alert("Please select rating");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, rating, productId }),
    });

    const data = await res.json();
    if (res.ok) {
      onSuccess();
      onClose();
      setForm({ name: "", message: "" });
      setRating(0);
    } else {
      alert(data.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white w-[90%] max-w-lg rounded-xl shadow-lg p-6 relative">

        {/* Close Button */}
        <button className="absolute right-4 top-4" onClick={onClose}>
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-2">
          Rate Your Purchase Experience
        </h2>
        <p className="text-center text-gray-500 text-sm mb-4">
          Share your experience to help others
        </p>

        {/* Star Rating */}
        <div className="flex justify-center gap-4 my-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-4xl cursor-pointer transition ${
                (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <input
          placeholder="Enter Your Name"
          className="border w-full p-2 rounded mb-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          placeholder="Message"
          className="border w-full p-2 rounded h-28"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <button
          onClick={submitReview}
          className="bg-blue-700 w-full mt-4 text-white py-2 rounded-lg font-semibold"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}
