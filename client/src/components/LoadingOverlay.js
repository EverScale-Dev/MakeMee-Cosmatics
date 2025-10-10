"use client";
import { ShoppingCart, Package, Truck, Tag } from "lucide-react";

export default function LoadingOverlay({ show = false }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[9999]">
      <div className="flex gap-6 p-6 rounded-2xl bg-white shadow-xl">
        <ShoppingCart className="w-12 h-12 text-blue-600 animate-bounce delay-0" />
        <Package className="w-12 h-12 text-green-600 animate-bounce delay-150" />
        <Truck className="w-12 h-12 text-orange-600 animate-bounce delay-300" />
        <Tag className="w-12 h-12 text-pink-600 animate-bounce delay-500" />
      </div>
    </div>
  );
}
