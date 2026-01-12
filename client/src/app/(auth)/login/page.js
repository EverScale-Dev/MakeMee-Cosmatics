"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { Box, TextField, Button, Typography, Alert, Link, Divider } from "@mui/material";
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, { email, password });
      const { _id, fullName, email: userEmail, token } = res.data;

      dispatch(setCredentials({
        user: { _id, fullName, email: userEmail },
        token,
      }));

      // Check if it's admin login (email/password) - redirect to admin
      // For customer login, redirect to intended destination
      if (redirectUrl === "/") {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
    } catch (err) {
      setError("Invalid email or password");
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
      const { _id, fullName, email: userEmail, avatar, token } = response.data;

      dispatch(setCredentials({
        user: { _id, fullName, email: userEmail, avatar },
        token,
      }));

      // Merge guest cart with user's cart in database
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
      bgcolor="#f3f4f6"
      px={2}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: 400 },
          p: 5,
          bgcolor: "white",
          boxShadow: 4,
          borderRadius: 3,
          transition: "0.3s",
          "&:hover": {
            boxShadow: 6,
          },
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center" fontWeight={600}>
          Sign In
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
            disabled={loading}
          />
        </Box>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            or admin login
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
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          Login
        </Button>

        <Button
          component={Link}
          href="/register"
          variant="outlined"
          fullWidth
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Register
        </Button>

        <Link href="/forgotpassword" sx={{ mt: 2, textAlign: "center", display: "block" }}>
          <Typography variant="body2" color="primary" fontWeight={500}>
            Forgot Password?
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}
