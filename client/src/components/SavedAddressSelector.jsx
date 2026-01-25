import { useState } from "react";
import { MapPin, Plus, Check, Home, Briefcase, Building2 } from "lucide-react";

const labelIcons = {
  Home: Home,
  Work: Briefcase,
  Other: Building2,
};

export default function SavedAddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
  onAddNew,
}) {
  const [selected, setSelected] = useState(
    selectedAddressId || addresses?.find((a) => a.isDefault)?._id || addresses?.[0]?._id
  );

  const handleSelect = (addressId) => {
    setSelected(addressId);
    onSelect(addressId);
  };

  if (!addresses || addresses.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
        <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
          <MapPin size={20} /> Delivery Address
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No saved addresses found</p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FC6CB4] text-white rounded-full hover:bg-[#e55a9f] transition"
          >
            <Plus size={18} /> Add New Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <MapPin size={20} /> Delivery Address
        </h2>
        {addresses.length < 5 && (
          <button
            onClick={onAddNew}
            className="flex items-center gap-1 text-sm text-[#731162] hover:underline"
          >
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      <div className="space-y-3">
        {addresses.map((address) => {
          const Icon = labelIcons[address.label] || MapPin;
          const isSelected = selected === address._id;

          return (
            <button
              key={address._id}
              onClick={() => handleSelect(address._id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition ${
                isSelected
                  ? "border-[#FC6CB4] bg-pink-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full ${
                    isSelected ? "bg-[#FC6CB4] text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{address.label}</span>
                    {address.isDefault && (
                      <span className="text-xs bg-[#FC6CB4] text-white px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 break-words">
                    {address.apartment_address && `${address.apartment_address}, `}
                    {address.street_address1}
                  </p>
                  <p className="text-sm text-gray-500">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
                {isSelected && (
                  <div className="p-1 bg-[#FC6CB4] rounded-full">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
