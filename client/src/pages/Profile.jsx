import { useState, useEffect } from "react";
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
  LogOut,
  ArrowLeft,
  Home,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services";
import { toast } from "sonner";

import AddressSection from "@/components/AdressUserProfile/AddressSection";
import OrdersSection from "@/components/OrderUserProfile/OrdersSection";
import PhoneVerificationModal from "@/components/PhoneVerificationModal";

export default function Profile() {
  const navigate = useNavigate();
  const { user: authUser, logout, updateUser } = useAuth();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    phoneVerified: false,
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [verifyPhoneOpen, setVerifyPhoneOpen] = useState(false);

  useEffect(() => {
    if (!authUser) {
      navigate("/signup");
      return;
    }

    // Fetch fresh profile data
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setUser({
          name: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          phoneVerified: data.phoneVerified || false,
          avatar: data.avatar || "",
        });
      } catch (error) {
        // Use auth context data as fallback
        setUser({
          name: authUser.fullName || "",
          email: authUser.email || "",
          phone: authUser.phone || "",
          phoneVerified: authUser.phoneVerified || false,
          avatar: authUser.avatar || "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser, navigate]);

  const handleSaveProfile = async (updated) => {
    try {
      const data = await authService.updateProfile({
        fullName: updated.name,
        phone: updated.phone,
      });
      setUser({
        name: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        phoneVerified: data.phoneVerified || false,
        avatar: data.avatar || "",
      });
      updateUser(data);
      toast.success("Profile updated successfully");
      setEditOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePhoneVerified = (verifiedPhone) => {
    setUser((prev) => ({
      ...prev,
      phone: verifiedPhone,
      phoneVerified: true,
    }));
    // Update auth context too
    updateUser({ phone: verifiedPhone, phoneVerified: true });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#731162]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with back navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-full hover:bg-[#FC6CB4]/10 transition"
              title="Back to Home"
            >
              <ArrowLeft className="w-6 h-6 text-[#731162]" />
            </Link>
            <h1 className="text-3xl font-semibold">My Profile</h1>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#731162] hover:bg-[#FC6CB4]/10 rounded-full transition"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard
              user={user}
              onEdit={() => setEditOpen(true)}
              onLogout={handleLogout}
              onVerifyPhone={() => setVerifyPhoneOpen(true)}
            />
            <NotificationCard />
            <LegalCard />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <AddressSection />
            <OrdersSection />

            <SupportSection />
          </div>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {verifyPhoneOpen && (
        <PhoneVerificationModal
          currentPhone={user.phone}
          onClose={() => setVerifyPhoneOpen(false)}
          onVerified={handlePhoneVerified}
        />
      )}
    </div>
  );
}


/* ======================
   LEFT SIDE COMPONENTS
====================== */

function ProfileCard({ user, onEdit, onLogout, onVerifyPhone }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=731162&color=fff`}
          className="w-24 h-24 rounded-full object-cover"
          alt="profile"
        />
        <div className="flex-1">
          <h2 className="font-medium text-lg">{user.name || "User"}</h2>
          <p className="text-sm text-gray-500">Customer Account</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <InfoRow icon={User} label="Name" value={user.name || "-"} />
        <InfoRow icon={Mail} label="Email" value={user.email || "-"} />

        {/* Phone with verification status */}
        <div className="flex items-center gap-3 text-sm">
          <Phone size={16} className="text-gray-500" />
          <span className="w-20 text-gray-500">Mobile</span>
          <div className="flex items-center gap-2 flex-1">
            <span className="font-medium">{user.phone || "-"}</span>
            {user.phone && (
              user.phoneVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  <CheckCircle size={12} />
                  Verified
                </span>
              ) : (
                <button
                  onClick={onVerifyPhone}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full hover:bg-amber-200 transition"
                >
                  <AlertCircle size={12} />
                  Verify
                </button>
              )
            )}
            {!user.phone && (
              <button
                onClick={onVerifyPhone}
                className="text-xs text-[#731162] hover:underline"
              >
                Add phone
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button className="cursor-pointer" icon={Pencil} onClick={onEdit}>
          Edit Profile
        </Button>
        <Button className="cursor-pointer" variant="danger" icon={LogOut} onClick={onLogout}>
          Logout
        </Button>
      </div>
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

function Button({
  children,
  icon: Icon,
  variant = "ghost",
  className = "",
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
