import { X, LogIn, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPromptModal({ onClose }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-5 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[#731162]/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-[#731162]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Login Required</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Please login to add items to your cart and enjoy a seamless shopping experience.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[#731162] hover:bg-[#5a0d4d] text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn size={18} />
            Login / Sign Up
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
