"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateAuth } from "../store/slices/authSlice";

export default function AuthHydrator({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Hydrate auth state from localStorage on initial client-side mount
    dispatch(hydrateAuth());
  }, [dispatch]);

  return children;
}
