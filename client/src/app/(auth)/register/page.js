"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import { setCredentials } from "../../../store/slices/authSlice";
import { mergeCartOnLogin } from "../../../store/slices/cartSlice";
import api from "../../../utils/axiosClient";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/auth/register-user", {
        fullName,
        email,
        password,
      });
      const { _id, fullName: name, email: userEmail, authProvider, role, token } = res.data;

      dispatch(
        setCredentials({
          user: { _id, fullName: name, email: userEmail, authProvider, role },
          token,
        })
      );

      // Merge guest cart with user's cart
      dispatch(mergeCartOnLogin());

      router.push(redirectUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/auth/google", {
        credential: credentialResponse.credential,
      });
      const { _id, fullName, email: userEmail, avatar, authProvider, role, token } = response.data;

      dispatch(
        setCredentials({
          user: { _id, fullName, email: userEmail, avatar, authProvider, role },
          token,
        })
      );

      // Merge guest cart with user's cart
      dispatch(mergeCartOnLogin());

      router.push(redirectUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-up was cancelled or failed");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f8f9fa"
      px={2}
      py={4}
    >
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: 420 },
          p: { xs: 3, sm: 5 },
          bgcolor: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: 3,
        }}
      >
        {/* Logo */}
        <Box display="flex" justifyContent="center" mb={3}>
          <Link href="/">
            <img
              src="/logo.webp"
              alt="MakeMee Logo"
              style={{ width: 150, height: "auto" }}
            />
          </Link>
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          fontWeight={600}
          color="#333"
        >
          Create Account
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
          mb={3}
        >
          Join us for a better shopping experience
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Google Sign Up */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signup_with"
            shape="rectangular"
            width="100%"
          />
        </Box>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            or sign up with email
          </Typography>
        </Divider>

        <TextField
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
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
          label="Email"
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
          helperText="At least 6 characters"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
            bgcolor: "#731162",
            "&:hover": {
              bgcolor: "#5a0d4d",
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
        </Button>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link
              href="/login"
              style={{ color: "#731162", fontWeight: 600, textDecoration: "none" }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
