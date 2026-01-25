import { useState, useRef, useEffect } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { X, MapPin } from "lucide-react";
import { toast } from "sonner";

const libraries = ["places"];

export default function AddressFormModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  saving = false,
}) {
  const [form, setForm] = useState({
    label: initialData?.label || "Home",
    apartment_address: initialData?.apartment_address || "",
    street_address1: initialData?.street_address1 || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
    lat: initialData?.lat || null,
    lng: initialData?.lng || null,
  });

  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        label: initialData.label || "Home",
        apartment_address: initialData.apartment_address || "",
        street_address1: initialData.street_address1 || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
        lat: initialData.lat || null,
        lng: initialData.lng || null,
      });
    }
  }, [initialData]);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();

    if (place && place.address_components) {
      const addressComponents = {
        street_address1: place.formatted_address || "",
        city: "",
        state: "",
        pincode: "",
        lat: place.geometry?.location?.lat() || null,
        lng: place.geometry?.location?.lng() || null,
      };

      place.address_components.forEach((component) => {
        const type = component.types[0];
        if (type === "locality") {
          addressComponents.city = component.long_name;
        } else if (type === "administrative_area_level_1") {
          addressComponents.state = component.long_name;
        } else if (type === "postal_code") {
          addressComponents.pincode = component.long_name;
        }
      });

      setForm((prev) => ({
        ...prev,
        ...addressComponents,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.street_address1.trim()) {
      toast.error("Please enter a street address");
      return;
    }
    if (!form.city.trim()) {
      toast.error("Please enter a city");
      return;
    }
    if (!form.state.trim()) {
      toast.error("Please enter a state");
      return;
    }
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MapPin size={20} />
            {initialData ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Label Selection */}
          <div>
            <label className="text-sm text-gray-600 block mb-2">Address Label</label>
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setForm({ ...form, label })}
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    form.label === label
                      ? "bg-[#FC6CB4] text-white border-[#FC6CB4]"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Google Places Autocomplete */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Search Location *
            </label>
            {isLoaded ? (
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceChanged}
                options={{
                  componentRestrictions: { country: "IN" },
                }}
              >
                <input
                  type="text"
                  placeholder="Start typing to search address..."
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FC6CB4] outline-none"
                />
              </Autocomplete>
            ) : (
              <div className="w-full border rounded-xl px-4 py-3 bg-gray-50 text-gray-400">
                Loading Google Maps...
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Select from suggestions to auto-fill address fields
            </p>
          </div>

          {/* Apartment/Flat Number */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Flat / House No / Apartment
            </label>
            <input
              type="text"
              value={form.apartment_address}
              onChange={(e) => setForm({ ...form, apartment_address: e.target.value })}
              placeholder="e.g., Flat 101, Tower A"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FC6CB4] outline-none"
            />
          </div>

          {/* Street Address */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Street / Locality / Area *
            </label>
            <input
              type="text"
              value={form.street_address1}
              onChange={(e) => setForm({ ...form, street_address1: e.target.value })}
              placeholder="Building name, street, locality"
              required
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FC6CB4] outline-none"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">City *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FC6CB4] outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">State *</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                required
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FC6CB4] outline-none"
              />
            </div>
          </div>

          {/* Pincode */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">Pincode *</label>
            <input
              type="text"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
              placeholder="6-digit pincode"
              required
              maxLength={6}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FC6CB4] outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-[#FC6CB4] text-white rounded-xl hover:bg-[#e55a9f] transition disabled:opacity-50"
            >
              {saving ? "Saving..." : initialData ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
