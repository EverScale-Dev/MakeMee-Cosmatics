"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import api from "../../../utils/axiosClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.push("/admin");
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/api/auth/admin-login", { email, password });
      const { token } = res.data;

      // Store admin token separately
      localStorage.setItem("adminToken", token);

      router.push("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#1a1a2e"
      px={2}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: 400 },
          p: { xs: 3, sm: 5 },
          bgcolor: "white",
          boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
          borderRadius: 3,
        }}
      >
        {/* Admin Icon */}
        <Box display="flex" justifyContent="center" mb={2}>
          <AdminPanelSettingsIcon
            sx={{ fontSize: 60, color: "#1a1a2e" }}
          />
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          fontWeight={700}
          color="#1a1a2e"
        >
          Admin Login
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
          mb={3}
        >
          Access restricted to administrators only
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Admin Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
          size="medium"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          size="medium"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Button
          variant="contained"
          type="submit"
          fullWidth
          disabled={loading}
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            bgcolor: "#1a1a2e",
            "&:hover": {
              bgcolor: "#16213e",
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In as Admin"}
        </Button>

        <Box mt={3} textAlign="center">
          <Link
            href="/"
            style={{ color: "#666", fontSize: "0.9rem", textDecoration: "none" }}
          >
            Return to Store
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
