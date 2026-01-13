import { Truck, FileText, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderCard({ data, onView }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-medium">Order #{data.id}</span>
        <OrderStatusBadge status={data.status} />
      </div>

      <p className="text-sm text-gray-600">
        {data.quantity} × {data.product}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">₹{data.amount}</span>
        <span className="text-xs text-gray-500">{data.date}</span>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <ActionButton icon={FileText} label="Invoice" />

        <ActionButton
          icon={ArrowRight}
          label="Go to Order"
          onClick={() => navigate(`/orders/${data.id}`)}
        />

        <ActionButton
          label="View Details"
          onClick={onView}
          variant="ghost"
        />
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, variant, ...props }) {
  return (
    <button
      {...props}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
        ${variant === "ghost"
          ? "border"
          : "bg-gray-900 text-white"}
      `}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}
