import { Truck, FileText, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderCard({ data, onView }) {
  const navigate = useNavigate();

  return (
    <div className="shadow-lg  rounded-xl p-4 space-y-4">
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



function ActionButton({
  children,
  icon: Icon,
  variant = "ghost",
  className = "",
  label,
  ...props
}) {
  const baseStyles =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#731162] text-white hover:bg-[#5e0d4f]",
    ghost:
      "border border-[#731162] text-[#731162] hover:bg-[#731162] hover:text-white",
    danger:
      "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );
}