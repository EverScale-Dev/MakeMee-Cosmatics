import { useState, useEffect } from "react";
import settingsService from "../../services/settingsService";

const ALL_PAGES = [
  "Dashboard",
  "Orders",
  "Products",
  "Customers",
  "Coupons",
  "Reviews",
  "Messages",
  "Settings",
];

export default function AdminAccess() {
  const [allowedPages, setAllowedPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await settingsService.getAdminPermissions();
        setAllowedPages(data.pages || []);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  const togglePage = (page) => {
    setAllowedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const data = await settingsService.updateAdminPermissions(allowedPages);
      setAllowedPages(data.pages);
      setMessage("Permissions saved successfully");
    } catch (error) {
      setMessage("Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Admin Access Control</h1>
      <p className="text-gray-500 mb-6">
        Select which pages regular admins can access. Super admins always have
        full access.
      </p>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        {ALL_PAGES.map((page) => (
          <label
            key={page}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
          >
            <span className="font-medium">{page}</span>
            <input
              type="checkbox"
              checked={allowedPages.includes(page)}
              onChange={() => togglePage(page)}
              className="w-5 h-5 rounded text-pink-500 focus:ring-pink-500"
            />
          </label>
        ))}

        {message && (
          <p
            className={`text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-4 bg-pink-500 text-white py-2.5 rounded-lg font-medium hover:bg-pink-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Permissions"}
        </button>
      </div>
    </div>
  );
}
