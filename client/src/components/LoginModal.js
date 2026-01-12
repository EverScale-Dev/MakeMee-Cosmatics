"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { setCredentials } from "../store/slices/authSlice";
import { mergeCartOnLogin } from "../store/slices/cartSlice";
import api from "../utils/axiosClient";

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/google", {
        credential: credentialResponse.credential,
      });

      const { _id, fullName, email, avatar, authProvider, role, token } = response.data;

      dispatch(
        setCredentials({
          user: { _id, fullName, email, avatar, authProvider, role },
          token,
        })
      );

      // Merge guest cart with user's cart in database
      dispatch(mergeCartOnLogin());

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was cancelled or failed.");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Sign In</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <p className="text-gray-600 mb-6 text-sm">
          Sign in to add items to your cart and checkout.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          {loading ? (
            <div className="py-3">Signing in...</div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
            />
          )}
        </div>

        <p className="mt-6 text-xs text-gray-500 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
