import { useState, useRef } from "react";
import UnderlineInput from "../components/UnderlineInput";

export default function Signup() {
  const [phone, setPhone] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4">
      {/* Signup Card */}
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[400px] max-w-lg">
        <h2 className="text-2xl font-semibold text-black mb-1">
          Create Account
        </h2>
        <p className="text-black text-sm mb-8">
          Sign up using your phone number
        </p>

        <form className="space-y-6">
          <UnderlineInput
            placeholder="+91 Phone number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* Phone Signup */}
          <button
            type="button"
            onClick={() => setShowOtp(true)}
            className="
              w-full bg-[#FC6CB4] text-black py-3 rounded-full
              hover:bg-[#F0A400]
              transition-all duration-300 font-medium
            "
          >
            Send OTP
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-black/20" />
            <span className="text-xs text-black/50 uppercase">
              or
            </span>
            <div className="flex-1 h-px bg-black/20" />
          </div>

          {/* Google Signup */}
          <button
            type="button"
            className="
              w-full flex items-center justify-center gap-3
              border border-black/20 py-3 rounded-full
              hover:bg-black/5 transition-all duration-300
            "
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-black">
              Continue with Google
            </span>
          </button>
        </form>
      </div>

      {/* OTP MODAL */}
      {showOtp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
            <h3 className="text-xl font-semibold text-black text-center mb-1">
              Verify OTP
            </h3>
            <p className="text-sm text-black/60 text-center mb-6">
              Enter the 6-digit code sent to your phone
            </p>

            <div className="flex justify-between gap-2 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, index)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="
                    w-12 h-12 text-center text-lg
                    border-b border-black/30
                    focus:outline-none
                    focus:border-[#FC6CB4]
                    transition-all
                  "
                />
              ))}
            </div>

            <button
              className="
                w-full bg-[#FC6CB4] text-black py-3 rounded-full
                hover:bg-[#F0A400]
                transition-all duration-300 font-medium
              "
            >
              Verify
            </button>

            <button
              onClick={() => setShowOtp(false)}
              className="absolute top-3 right-4 text-black/40 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
