import { useState, useEffect } from "react";
import { MapPin, Plus, Pencil, Trash2, Star, Home, Briefcase, Building2 } from "lucide-react";
import { authService } from "@/services";
import { toast } from "sonner";
import AddressFormModal from "@/components/AddressFormModal";

const labelIcons = {
  Home: Home,
  Work: Briefcase,
  Other: Building2,
};

export default function AddressSection() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const profile = await authService.getProfile();
        setAddresses(profile.addresses || []);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleAddAddress = async (data) => {
    setSaving(true);
    try {
      const response = await authService.addAddress(data);
      setAddresses(response.addresses);
      toast.success("Address added successfully");
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAddress = async (data) => {
    if (!editingAddress) return;

    setSaving(true);
    try {
      const response = await authService.updateAddress(editingAddress._id, data);
      setAddresses(response.addresses);
      toast.success("Address updated successfully");
      setEditingAddress(null);
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update address");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setDeleting(addressId);
    try {
      const response = await authService.deleteAddress(addressId);
      setAddresses(response.addresses);
      toast.success("Address deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    } finally {
      setDeleting(null);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await authService.setDefaultAddress(addressId);
      setAddresses(response.addresses);
      toast.success("Default address updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to set default address");
    }
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingAddress(null);
    setModalOpen(false);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <MapPin size={18} /> Saved Addresses
        </h2>
        {addresses.length < 5 && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-1 text-sm text-[#731162] hover:underline"
          >
            <Plus size={14} /> Add Address
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#731162]"></div>
        </div>
      ) : addresses.length > 0 ? (
        <div className="space-y-3">
          {addresses.map((address) => {
            const Icon = labelIcons[address.label] || MapPin;

            return (
              <div
                key={address._id}
                className={`border rounded-xl p-4 transition ${
                  address.isDefault ? "border-[#FC6CB4] bg-pink-50/50" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        address.isDefault ? "bg-[#FC6CB4] text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{address.label}</span>
                        {address.isDefault && (
                          <span className="text-xs bg-[#FC6CB4] text-white px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.apartment_address && `${address.apartment_address}, `}
                        {address.street_address1}
                      </p>
                      <p className="text-sm text-gray-500">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="p-2 text-gray-400 hover:text-yellow-500 transition"
                        title="Set as default"
                      >
                        <Star size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(address)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      disabled={deleting === address._id}
                      className="p-2 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {addresses.length >= 5 && (
            <p className="text-xs text-gray-500 text-center pt-2">
              Maximum 5 addresses allowed. Delete one to add a new address.
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No addresses saved</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FC6CB4] text-white rounded-lg hover:bg-[#e55a9f] transition"
          >
            <Plus size={16} /> Add Your First Address
          </button>
        </div>
      )}

      <AddressFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={editingAddress ? handleUpdateAddress : handleAddAddress}
        initialData={editingAddress}
        saving={saving}
      />
    </section>
  );
}
