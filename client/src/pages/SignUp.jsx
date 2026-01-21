import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UnderlineInput from "../components/UnderlineInput";
import { toast } from "sonner";

export default function SignUp() {
  const navigate = useNavigate();
  const { login, register, googleLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast.success("Login successful!");
      } else {
        if (!form.fullName.trim()) {
          toast.error("Please enter your name");
          setLoading(false);
          return;
        }
        await register(form.fullName, form.email, form.password);
        toast.success("Account created successfully!");
      }
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Google OAuth implementation
    // This requires setting up Google OAuth in the frontend
    // For now, we'll show a message
    toast.info("Google login - Configure VITE_GOOGLE_CLIENT_ID in .env");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[400px] max-w-lg">
        <h2 className="text-2xl font-semibold text-black mb-1">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-black text-sm mb-8">
          {isLogin ? "Sign in to your account" : "Sign up with your email"}
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <UnderlineInput
              placeholder="Full Name"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
          )}

          <UnderlineInput
            placeholder="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <UnderlineInput
            placeholder="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
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
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-black/20" />
            <span className="text-xs text-black/50 uppercase">or</span>
            <div className="flex-1 h-px bg-black/20" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
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

        <p className="text-center text-sm text-black/60 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#FC6CB4] hover:underline font-medium"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
