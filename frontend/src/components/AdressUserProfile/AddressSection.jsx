import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import AddressCard from "./AddressCard";
import AddressModal from "./AddressModal";

const initialAddresses = [
  {
    id: 1,
    name: "Home",
    address: "Flat 201, MG Road",
    city: "Kolhapur",
    pincode: "416001",
    phone: "+91 9876543210",
    isDefault: true,
  },
  {
    id: 2,
    name: "Office",
    address: "IT Park, Shivaji Nagar",
    city: "Pune",
    pincode: "411005",
    phone: "+91 9876543210",
    isDefault: false,
  },
];

export default function AddressSection() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleSave = (data) => {
    if (editData) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editData.id ? data : a))
      );
    } else {
      setAddresses((prev) => [...prev, { ...data, id: Date.now() }]);
    }
    setModalOpen(false);
    setEditData(null);
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <MapPin size={18} /> Saved Addresses
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 text-sm text-blue-600"
        >
          <Plus size={14} /> Add New
        </button>
      </div>

      {/* SCROLLABLE ADDRESS LIST */}
      <div className="max-h-64 pb-4 overflow-y-auto space-y-3 pr-1">
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            data={addr}
            onEdit={() => {
              setEditData(addr);
              setModalOpen(true);
            }}
            onDelete={() => handleDelete(addr.id)}
            onSetDefault={() => setDefault(addr.id)}
          />
        ))}
      </div>

      {modalOpen && (
        <AddressModal
          initialData={editData}
          onClose={() => {
            setModalOpen(false);
            setEditData(null);
          }}
          onSave={handleSave}
        />
      )}
    </section>
  );
}
