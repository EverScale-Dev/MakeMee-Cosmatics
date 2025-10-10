"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { Box, TextField, Button, Typography, Alert, Link } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      router.push("/admin");
    } catch (err) {
      setError("Invalid email or password");
    }
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
          Admin Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

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
