"use client";
import { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Alert, Link } from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";

const FormCard = styled(Box)(({ theme }) => ({
  maxWidth: 400,
  width: "100%",
  backgroundColor: "white",
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0px 8px 30px rgba(0,0,0,0.1)",
  transition: "0.3s",
  "&:hover": {
    boxShadow: "0px 12px 40px rgba(0,0,0,0.15)",
  },
}));

const SubmitButton = styled(Button)({
  marginTop: "1.5rem",
  padding: "0.75rem 1.5rem",
  borderRadius: "10px",
  textTransform: "none",
  fontSize: "1rem",
});

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!tempPassword) {
      setErrorMessage("Temporary password is required.");
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setErrorMessage(
        "Password must be at least 8 characters, with uppercase, lowercase, number, and special character."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    setErrorMessage("");

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        email,
        tempPassword,
        newPassword,
      });
      setMessage(res.data.message);
      setErrorMessage("");
      setEmail("");
      setTempPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.push("/login");
    } catch (error) {
      setErrorMessage(error.response?.data.message || "Error resetting password.");
      setMessage("");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5" p={2}>
      <FormCard component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom align="center" fontWeight={600}>
          Reset Password
        </Typography>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <TextField
          label="Temporary Password"
          type="password"
          value={tempPassword}
          onChange={(e) => setTempPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />

        <SubmitButton variant="contained" color="primary" type="submit" fullWidth>
          Reset Password
        </SubmitButton>

        {message && <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>{message}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{errorMessage}</Alert>}

        <Button
          component={Link}
          href="/login"
          variant="outlined"
          fullWidth
          sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
        >
          Back to Login
        </Button>
      </FormCard>
    </Box>
  );
}
