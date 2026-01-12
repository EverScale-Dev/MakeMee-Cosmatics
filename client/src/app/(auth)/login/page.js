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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/api/auth/user-login", { email, password });
      const { _id, fullName, email: userEmail, avatar, authProvider, role, token } = res.data;

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
      setError(err.response?.data?.message || "Invalid email or password");
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
      setError(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was cancelled or failed");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f8f9fa"
      px={2}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
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
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
          mb={3}
        >
          Sign in to continue to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Google Sign In */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            width="100%"
          />
        </Box>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            or sign in with email
          </Typography>
        </Divider>

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
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Link
          href="/forgotpassword"
          style={{ textDecoration: "none", alignSelf: "flex-end", marginTop: 4 }}
        >
          <Typography variant="body2" color="primary" fontWeight={500}>
            Forgot Password?
          </Typography>
        </Link>

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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
        </Button>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{ color: "#731162", fontWeight: 600, textDecoration: "none" }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
