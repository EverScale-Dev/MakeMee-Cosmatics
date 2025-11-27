"use client";
import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Card, CardContent, CircularProgress, Alert, Link } from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";

const RegisterCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  width: "100%",
  boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  transition: "0.3s",
  "&:hover": {
    boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.15)",
  },
}));

const SubmitButton = styled(Button)({
  padding: "0.75rem 1.5rem",
  fontSize: "1.1rem",
  marginTop: "1.5rem",
  borderRadius: "10px",
  textTransform: "none",
});

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(true);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format.";
    if (!isPasswordDisabled && !password.trim()) newErrors.password = "Password is required.";
    else if (password && password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      setIsEmailSent(false);
      setIsPasswordDisabled(true);
      setErrorMessage("");
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, { fullName, email });
      if (res.status === 201) {
        setSuccessMessage("Password sent to your email. Please enter it below.");
        setIsPasswordDisabled(false);
        setIsEmailSent(true);
      }
    } catch (error) {
      setErrorMessage("Error registering user.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!validate()) return;
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/complete-registration`, {
        fullName,
        email,
        password,
      });
      if (res.status === 201) {
        setSuccessMessage("Registration completed successfully!");
        setErrorMessage("");
        setPassword("");
        setFullName("");
        setEmail("");
        setIsPasswordDisabled(true);
        setIsEmailSent(false);
        setIsRegistered(true);
      }
    } catch (error) {
      setErrorMessage("Password is incorrect.");
    }
  };

  const handleResetPassword = () => {
    router.push("/resetpassword");
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5" p={2}>
      <RegisterCard>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
            Admin Registration
          </Typography>

          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.fullName}
            helperText={errors.fullName}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          {isEmailSent && (
            <>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password}
                disabled={isPasswordDisabled}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <SubmitButton
                variant="contained"
                color="primary"
                onClick={handlePasswordSubmit}
                disabled={isPasswordDisabled}
                fullWidth
              >
                Complete Registration
              </SubmitButton>
            </>
          )}

          {!isEmailSent && (
            <SubmitButton
              variant="contained"
              color="primary"
              onClick={handleRegister}
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? "Sending..." : "Send Password to Email"}
            </SubmitButton>
          )}

          {errorMessage && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{errorMessage}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>{successMessage}</Alert>}

          {isRegistered && (
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleResetPassword}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Reset Password
            </Button>
          )}

          <Link href="/login" sx={{ textDecoration: 'none', mt: 2, display: 'block' }}>
            <Button variant="outlined" fullWidth sx={{ borderRadius: 2 }}>
              Already have an account? Login
            </Button>
          </Link>
        </CardContent>
      </RegisterCard>
    </Box>
  );
}
