import { useState } from "react";
import Modal from "../Modal";

export default function AddressModal({ onClose, onSave, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      address: "",
      city: "",
      pincode: "",
      phone: "",
      isDefault: false,
    }
  );

  return (
    <Modal title={initialData ? "Edit Address" : "Add New Address"} onClose={onClose}>
      <Input label="Address Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Full Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      <Input label="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
      <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

      <button
        onClick={() => onSave(form)}
        className="w-full bg-black text-white py-2 rounded-lg mt-4"
      >
        Save Address
      </button>
    </Modal>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500">{label}</label>
      <input {...props} className="border rounded-lg px-3 py-2 text-sm w-full" />
    </div>
  );
}
