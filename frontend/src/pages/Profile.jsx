import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Save,
  X,
  Package,
  Heart,
  Truck,
  FileText,
  Bell,
  Shield,
  Trash2,
  CreditCard,
  Wallet,
  HelpCircle,
} from "lucide-react";


import AddressSection from "@/components/AdressUserProfile/AddressSection";
import OrdersSection from "@/components/OrderUserProfile/OrdersSection";

export default function Profile() {
  const [user, setUser] = useState({
    name: "Vallabh Sathe",
    email: "vallabh@email.com",
    phone: "+91 9876543210",
  });

  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard user={user} onEdit={() => setEditOpen(true)} />
            <NotificationCard />
            <LegalCard />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <AddressSection />
            <OrdersSection />
            <PaymentSection />
            <SupportSection />
          </div>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSave={(updated) => {
            setUser(updated);
            setEditOpen(false);
          }}
        />
      )}
    </div>
  );
}


/* ======================
   LEFT SIDE COMPONENTS
====================== */

function ProfileCard({ user, onEdit }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <img
          src="https://via.placeholder.com/96"
          className="w-24 h-24 rounded-full object-cover"
          alt="profile"
        />
        <div className="flex-1">
          <h2 className="font-medium text-lg">{user.name}</h2>
          <p className="text-sm text-gray-500">Customer Account</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <InfoRow icon={User} label="Name" value={user.name} />
        <InfoRow icon={Mail} label="Email" value={user.email} />
        <InfoRow icon={Phone} label="Mobile" value={user.phone} />
      </div>

      <Button className="mt-6" icon={Pencil} onClick={onEdit}>
        Edit Profile
      </Button>
    </Card>
  );
}

function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState(user);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Edit Profile</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <Input
          label="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Input
          label="Mobile Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button icon={Save} onClick={() => onSave(form)}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        {...props}
        className="border rounded-lg px-3 py-2 text-sm outline-none"
      />
    </div>
  );
}



function NotificationCard() {
  return (
    <Card title="Notifications" icon={Bell}>
      <Toggle label="Order Updates" />
      <Toggle label="Offers & Announcements" />
    </Card>
  );
}

function LegalCard() {
  return (
    <Card title="Security & Legal" icon={Shield}>
      <ActionRow label="Privacy Policy" />
      <ActionRow label="Terms & Conditions" />
      <ActionRow label="Delete Account" danger icon={Trash2} />
    </Card>
  );
}

/* ======================
   RIGHT SIDE COMPONENTS
====================== */




function PaymentSection() {
  return (
    <Card title="Payment Preferences" icon={CreditCard}>
      <InfoRow icon={Wallet} label="UPI" value="********@upi" />
      <InfoRow icon={CreditCard} label="Card" value="**** 4321" />
      <p className="text-sm text-gray-600">Default: Cash on Delivery</p>
    </Card>
  );
}

function SupportSection() {
  return (
    <Card title="Help & Support" icon={HelpCircle}>
      <p className="text-sm">Email: support@store.com</p>
      <p className="text-sm">WhatsApp: +91 99999 88888</p>
      <TextButton>Raise Support Ticket</TextButton>
    </Card>
  );
}

/* ======================
   UI BUILDING BLOCKS
====================== */

function Card({ title, icon: Icon, children }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      {title && (
        <div className="flex items-center gap-2 text-lg font-medium">
          {Icon && <Icon size={18} />}
          {title}
        </div>
      )}
      {children}
    </section>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon size={16} className="text-gray-500" />
      <span className="w-20 text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Toggle({ label }) {
  return (
    <label className="flex justify-between items-center text-sm">
      <span>{label}</span>
      <input type="checkbox" className="accent-black" />
    </label>
  );
}

function Button({ children, icon: Icon, variant, ...props }) {
  return (
    <button
      {...props}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm
        ${variant === "ghost"
          ? "border"
          : "bg-black text-white"}
      `}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function SmallButton({ children, icon: Icon, variant }) {
  return (
    <button
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
        ${variant === "ghost"
          ? "border"
          : "bg-gray-900 text-white"}
      `}
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

function TextButton({ children, danger }) {
  return (
    <button
      className={`text-sm ${
        danger ? "text-red-600" : "text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

function ActionRow({ label, danger, icon: Icon }) {
  return (
    <button
      className={`flex items-center gap-2 text-sm ${
        danger ? "text-red-600" : ""
      }`}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}
