"use client";
import { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Alert, Link } from "@mui/material";
import { styled } from "@mui/system";

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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateResetForm = () => {
    const newErrors = {};
    if (!tempPassword) newErrors.tempPassword = "Temporary password is required.";
    if (!newPassword) newErrors.newPassword = "New password is required.";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your new password.";
    if (newPassword && newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters.";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const emailErrors = {};
    if (!email) emailErrors.email = "Email is required.";
    else if (!validateEmail(email)) emailErrors.email = "Invalid email address.";
    setErrors(emailErrors);
    if (Object.keys(emailErrors).length > 0) return;

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`, { email });
      setMessage(res.data.message);
      setErrorMessage("");
      setShowResetForm(true);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Error sending reset link.";
      setErrorMessage(errMsg);
      setMessage("");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const resetErrors = validateResetForm();
    setErrors(resetErrors);
    if (Object.keys(resetErrors).length > 0) return;

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        email,
        tempPassword,
        newPassword,
      });
      setMessage(res.data.message);
      setErrorMessage("");
      setShowResetForm(false);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Error resetting password.";
      setErrorMessage(errMsg);
      setMessage("");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5" p={2}>
      <FormCard component="form" onSubmit={showResetForm ? handleResetSubmit : handleEmailSubmit}>
        <Typography variant="h5" gutterBottom align="center" fontWeight={600}>
          {showResetForm ? "Reset Password" : "Forgot Password"}
        </Typography>

        {!showResetForm ? (
          <>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              error={!!errors.email}
              helperText={errors.email}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <SubmitButton variant="contained" color="primary" type="submit" fullWidth>
              Send New Password
            </SubmitButton>
          </>
        ) : (
          <>
            <TextField
              label="Temporary Password"
              type="password"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              error={!!errors.tempPassword}
              helperText={errors.tempPassword}
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
              error={!!errors.newPassword}
              helperText={errors.newPassword}
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
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <SubmitButton variant="contained" color="primary" type="submit" fullWidth>
              Reset Password
            </SubmitButton>
          </>
        )}

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
