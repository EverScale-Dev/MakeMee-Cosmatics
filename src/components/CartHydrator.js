"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateCart, fetchCartFromBackend } from "../store/slices/cartSlice";

export default function CartHydrator({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");

    if (token) {
      // User is logged in - fetch cart from backend
      dispatch(fetchCartFromBackend());
    } else {
      // Guest user - hydrate from localStorage
      dispatch(hydrateCart());
    }
  }, [dispatch]);

  return children;
}
