import { Pencil, Trash2, Check } from "lucide-react";

export default function AddressCard({
  data,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  return (
    <div className="border rounded-xl p-4 text-sm space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">{data.name}</span>
        {data.isDefault && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Default
          </span>
        )}
      </div>

      <p className="text-gray-600">
        {data.address}, {data.city} – {data.pincode}
      </p>
      <p className="text-gray-600">{data.phone}</p>

      <div className="flex gap-4 pt-2">
        <button onClick={onEdit} className="text-blue-600 flex items-center gap-1">
          <Pencil size={14} /> Edit
        </button>
        <button onClick={onDelete} className="text-red-600 flex items-center gap-1">
          <Trash2 size={14} /> Delete
        </button>
        {!data.isDefault && (
          <button onClick={onSetDefault} className="text-green-600 flex items-center gap-1">
            <Check size={14} /> Set Default
          </button>
        )}
      </div>
    </div>
  );
}
