import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg border border-[#731162] bg-white text-[#731162] hover:bg-[#731162] hover:text-white transition"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-3xl font-semibold flex items-center gap-2 text-black">
            <Heart className="text-[#FC6CB4]" />
            My Wishlist
          </h1>
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 && (
          <div className="bg-white border border-[#FC6CB4]/30 rounded-2xl p-10 text-center space-y-4">
            <Heart size={48} className="mx-auto text-[#FC6CB4]" />

            <h2 className="text-xl font-medium text-black">
              Your wishlist is empty
            </h2>

            <p className="text-sm text-gray-600">
              Start adding products you love
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-[#F0A400] text-black px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* WISHLIST GRID */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
              <WishlistCard
                key={product.id}
                product={product}
                onRemove={() => removeFromWishlist(product.id)}
                onView={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   WISHLIST CARD
========================= */

function WishlistCard({ product, onRemove, onView }) {
  return (
    <div className="bg-white rounded-2xl border border-[#731162]/20 hover:shadow-lg transition overflow-hidden flex flex-col">

      {/* IMAGE */}
      <div
        className="h-48 bg-[#FC6CB4]/10 cursor-pointer"
        onClick={onView}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-sm text-black line-clamp-2">
          {product.name}
        </h3>

        <p className="text-lg font-semibold mt-2 text-[#731162]">
          ₹{product.price}
        </p>

        <div className="mt-auto flex gap-3 pt-4">
          <button
            onClick={onView}
            className="flex-1 bg-[#731162] text-white py-2 rounded-lg text-sm hover:opacity-90 transition"
          >
            View Product
          </button>

          <button
            onClick={onRemove}
            className="p-2 rounded-lg border border-[#FC6CB4] text-[#FC6CB4] hover:bg-[#FC6CB4] hover:text-white transition"
            title="Remove from wishlist"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
