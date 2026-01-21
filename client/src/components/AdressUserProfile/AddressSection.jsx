import { useState, useEffect } from "react";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { authService } from "@/services";
import { toast } from "sonner";
import GooglePlacesAutocomplete from "@/components/GooglePlacesAutocomplete";

export default function AddressSection() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const profile = await authService.getProfile();
        if (profile.address && (profile.address.street || profile.address.city)) {
          setAddress(profile.address);
        }
      } catch (error) {
        console.error("Failed to fetch address:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, []);

  const handleSave = async (data) => {
    try {
      const response = await authService.updateProfile({
        address: data,
      });
      setAddress(response.address);
      toast.success("Address saved successfully");
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  const handleDelete = async () => {
    try {
      await authService.updateProfile({
        address: { street: "", city: "", state: "", pincode: "" },
      });
      setAddress(null);
      toast.success("Address deleted");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <MapPin size={18} /> Saved Address
        </h2>
        {!address && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 text-sm text-blue-600"
          >
            <Plus size={14} /> Add Address
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#731162]"></div>
        </div>
      ) : address ? (
        <div className="border rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">Delivery Address</p>
              <p className="text-sm text-gray-600 mt-1">
                {address.street}
                {address.street && <br />}
                {address.city}, {address.state} - {address.pincode}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(true)}
                className="p-2 text-gray-500 hover:text-blue-600"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-500 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">No address saved</p>
      )}

      {modalOpen && (
        <AddressModal
          initialData={address}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </section>
  );
}

function AddressModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState({
    street: initialData?.street || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
  });
  const [saving, setSaving] = useState(false);

  const handleAddressSelect = (addressComponents) => {
    setForm({
      street: addressComponents.street || "",
      city: addressComponents.city || "",
      state: addressComponents.state || "",
      pincode: addressComponents.pincode || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.city || !form.state || !form.pincode) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h2 className="text-lg font-medium mb-4">
          {initialData ? "Edit Address" : "Add Address"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Google Places Autocomplete */}
          <div>
            <label className="text-sm text-gray-600">Search Address</label>
            <div className="mt-1">
              <GooglePlacesAutocomplete
                onAddressSelect={handleAddressSelect}
                placeholder="Start typing your address..."
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Search and select from suggestions, or fill manually below
            </p>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 mb-3">Address Details</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Street Address</label>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="House/Flat No., Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">State *</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Pincode *</label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  required
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm bg-[#731162] text-white rounded-lg disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
