import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Phone, Mail, MessageSquare, Save, Loader2, Wallet } from "lucide-react";
import settingsService from "../../services/settingsService";

const Settings = () => {
  const [settings, setSettings] = useState({
    phoneVerificationRequired: false,
    otpProvider: "EMAIL",
    codEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getAll();

      setSettings({
        phoneVerificationRequired: data.phoneVerificationRequired?.value ?? false,
        otpProvider: data.otpProvider?.value ?? "EMAIL",
        codEnabled: data.codEnabled?.value ?? true,
      });
    } catch (err) {
      setError("Failed to load settings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await settingsService.updateMany(settings);

      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-8 h-8 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">&times;</button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
          <button onClick={() => setSuccess(null)} className="float-right font-bold">&times;</button>
        </div>
      )}

      {/* Phone Verification Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Phone Verification</h2>
        </div>
        <hr className="mb-4" />

        <label className="flex items-start gap-4 cursor-pointer">
          <div className="relative mt-1">
            <input
              type="checkbox"
              checked={settings.phoneVerificationRequired}
              onChange={(e) => handleChange("phoneVerificationRequired", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
          <div>
            <p className="font-medium text-gray-800">Require phone verification for orders</p>
            <p className="text-sm text-gray-500">When enabled, customers must verify their phone number before placing orders</p>
          </div>
        </label>

        <div className="mt-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            settings.phoneVerificationRequired
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}>
            {settings.phoneVerificationRequired ? "ENABLED" : "DISABLED"}
          </span>
        </div>
      </div>

      {/* COD Settings Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Payment Options</h2>
        </div>
        <hr className="mb-4" />

        <label className="flex items-start gap-4 cursor-pointer">
          <div className="relative mt-1">
            <input
              type="checkbox"
              checked={settings.codEnabled}
              onChange={(e) => handleChange("codEnabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
          <div>
            <p className="font-medium text-gray-800">Enable Cash on Delivery (COD)</p>
            <p className="text-sm text-gray-500">Allow customers to pay cash when order is delivered</p>
          </div>
        </label>

        <div className="mt-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            settings.codEnabled
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}>
            {settings.codEnabled ? "COD ENABLED" : "COD DISABLED"}
          </span>
        </div>
      </div>

      {/* OTP Provider Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">OTP Delivery Method</h2>
        </div>
        <hr className="mb-4" />

        <p className="text-sm text-gray-600 mb-4">How should OTP be sent to customers?</p>

        <div className="space-y-3">
          {/* Email Option */}
          <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
            settings.otpProvider === "EMAIL"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}>
            <input
              type="radio"
              name="otpProvider"
              value="EMAIL"
              checked={settings.otpProvider === "EMAIL"}
              onChange={(e) => handleChange("otpProvider", e.target.value)}
              className="mt-1"
            />
            <div className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Email OTP</p>
                <p className="text-sm text-gray-500">Send OTP to customer's registered email address</p>
              </div>
            </div>
          </label>

          {/* SMS Option */}
          <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
            settings.otpProvider === "SMS"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}>
            <input
              type="radio"
              name="otpProvider"
              value="SMS"
              checked={settings.otpProvider === "SMS"}
              onChange={(e) => handleChange("otpProvider", e.target.value)}
              className="mt-1"
            />
            <div className="flex items-start gap-2">
              <MessageSquare className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">SMS OTP (MSG91)</p>
                <p className="text-sm text-gray-500">Send OTP via SMS to customer's phone number</p>
                <p className="text-xs text-amber-600 mt-1">Requires MSG91 credentials configured on server</p>
              </div>
            </div>
          </label>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Current:</strong>{" "}
            {settings.otpProvider === "SMS" ? (
              <span className="inline-flex items-center gap-1">
                SMS via MSG91 <MessageSquare className="w-4 h-4" />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                Email <Mail className="w-4 h-4" />
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
