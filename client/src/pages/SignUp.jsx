import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

const MODES = {
  LOGIN: "login",
  SIGNUP: "signup",
};

export default function SignUp() {
  const navigate = useNavigate();
  const { login, register, googleLogin } = useAuth();

  const [mode, setMode] = useState(MODES.LOGIN);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const isLogin = mode === MODES.LOGIN;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }

    if (!form.password.trim()) {
      toast.error("Please enter your password");
      return false;
    }

    if (!isLogin && !form.fullName.trim()) {
      toast.error("Please enter your name");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        await login(form.email.trim(), form.password);
        toast.success("Login successful!");
      } else {
        await register(
          form.fullName.trim(),
          form.email.trim(),
          form.password
        );
        toast.success("Account created successfully!");
      }

      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (loading) return;
    setLoading(true);

    try {
      await googleLogin(credentialResponse.credential);
      toast.success("Login successful!");
      navigate("/");
    } catch {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((prev) =>
      prev === MODES.LOGIN ? MODES.SIGNUP : MODES.LOGIN
    );

    setForm((prev) => ({
      ...prev,
      fullName: "",
      password: "",
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4 mt-10">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[400px] max-w-lg">
        <h2 className="text-2xl font-semibold text-black mb-1">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-black text-sm mb-8">
          {isLogin ? "Sign in to your account" : "Sign up with your email"}
        </p>

        {/* EMAIL / PASSWORD FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-black/20 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#FC6CB4]
                         transition"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-black/20 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-[#FC6CB4]
                       transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-black/20 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-[#FC6CB4]
                       transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-[#FC6CB4] text-black py-3 rounded-full
              hover:bg-[#F0A400]
              transition-all duration-300 font-medium
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-black/20" />
          <span className="text-xs text-black/50 uppercase">or</span>
          <div className="flex-1 h-px bg-black/20" />
        </div>

        {/* GOOGLE AUTH */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed")}
            useOneTap
            theme="outline"
            size="large"
            width="100%"
            text={isLogin ? "signin_with" : "signup_with"}
          />
        </div>

        <p className="text-center text-sm text-black/60 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="text-[#FC6CB4] hover:underline font-medium"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
