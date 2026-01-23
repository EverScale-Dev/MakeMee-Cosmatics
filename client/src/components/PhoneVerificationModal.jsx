import { useState, useEffect, useRef } from "react";
import { X, Phone, CheckCircle, Loader2 } from "lucide-react";
import { authService } from "@/services";
import { toast } from "sonner";

export default function PhoneVerificationModal({ currentPhone, onClose, onVerified }) {
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState(currentPhone || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.sendOtp(phone);
      toast.success("OTP sent to your phone");

      // In development, show the OTP
      if (response.otp) {
        toast.info(`Dev OTP: ${response.otp}`, { duration: 10000 });
      }

      setStep("otp");
      setCountdown(60);
      // Focus first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(phone, otpString);
      toast.success("Phone verified successfully!");
      onVerified(phone);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setOtp(["", "", "", "", "", ""]);
    handleSendOtp();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#731162] to-[#FC6CB4] p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Verify Phone Number</h2>
                <p className="text-sm text-white/80">
                  {step === "phone" ? "Enter your phone number" : "Enter the OTP sent to your phone"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "phone" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#FC6CB4] focus:border-transparent outline-none"
                    maxLength={10}
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading || phone.length !== 10}
                className="w-full py-3 bg-[#731162] text-white rounded-lg font-medium hover:bg-[#5e0d4f] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600">
                  OTP sent to <span className="font-medium">+91 {phone}</span>
                </p>
                <button
                  onClick={() => setStep("phone")}
                  className="text-sm text-[#731162] hover:underline mt-1"
                >
                  Change number
                </button>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-[#FC6CB4] focus:ring-2 focus:ring-[#FC6CB4]/20 outline-none transition"
                    maxLength={1}
                  />
                ))}
              </div>

              {/* Resend */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend OTP in <span className="font-medium">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-sm text-[#731162] hover:underline font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.some((d) => !d)}
                className="w-full py-3 bg-[#731162] text-white rounded-lg font-medium hover:bg-[#5e0d4f] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Verify OTP
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
