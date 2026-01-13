"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout, updateUser } from "../../store/slices/authSlice";
import { clearCart, resetHydration } from "../../store/slices/cartSlice";
import api from "../../utils/axiosClient";
import Header from "../../components/header";
import Footer from "../../components/footer";

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated, _hydrated } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [authProvider, setAuthProvider] = useState("local");

  // Redirect if not authenticated
  useEffect(() => {
    if (_hydrated && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [_hydrated, isAuthenticated, router]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const res = await api.get("/api/auth/me");
        const data = res.data;

        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setStreet(data.address?.street || "");
        setCity(data.address?.city || "");
        setState(data.address?.state || "");
        setPincode(data.address?.pincode || "");
        setAuthProvider(data.authProvider || "local");
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (_hydrated && isAuthenticated) {
      fetchProfile();
    }
  }, [_hydrated, isAuthenticated]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.put("/api/auth/me", {
        fullName,
        phone,
        address: { street, city, state, pincode },
      });

      dispatch(updateUser({
        fullName: res.data.fullName,
        phone: res.data.phone,
        address: res.data.address,
      }));

      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(resetHydration());
    router.push("/");
  };

  if (!_hydrated || loading) {
    return (
      <>
        <Header />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress sx={{ color: "#731162" }} />
        </Box>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          px: 3,
          py: 6,
          minHeight: "70vh",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1} color="#333">
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Manage your account information
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* Profile Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            mb: 4,
            p: 3,
            bgcolor: "#f8f9fa",
            borderRadius: 3,
          }}
        >
          <Avatar
            src={user?.avatar}
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#731162",
              fontSize: "2rem",
            }}
          >
            {fullName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
            <Chip
              icon={authProvider === "google" ? <GoogleIcon /> : <EmailIcon />}
              label={authProvider === "google" ? "Google Account" : "Email Account"}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Profile Form */}
        <Box component="form" onSubmit={handleSave}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Personal Information
          </Typography>

          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            label="Email"
            value={email}
            fullWidth
            margin="normal"
            disabled
            helperText={
              authProvider === "google"
                ? "Email cannot be changed for Google accounts"
                : "Email cannot be changed"
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="e.g., 9876543210"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Typography variant="subtitle1" fontWeight={600} mt={4} mb={2}>
            Address (Optional)
          </Typography>

          <TextField
            label="Street Address"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>

          <TextField
            label="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={saving}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "#731162",
                "&:hover": { bgcolor: "#5a0d4d" },
              }}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
