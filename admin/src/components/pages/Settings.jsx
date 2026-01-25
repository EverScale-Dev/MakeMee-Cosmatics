import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import settingsService from "../../services/settingsService";

const Settings = () => {
  const [settings, setSettings] = useState({
    phoneVerificationRequired: false,
    otpProvider: "EMAIL",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getAll();

      setSettings({
        phoneVerificationRequired: data.phoneVerificationRequired?.value ?? false,
        otpProvider: data.otpProvider?.value ?? "EMAIL",
      });
    } catch (err) {
      setError("Failed to load settings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await settingsService.updateMany(settings);

      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <SettingsIcon fontSize="large" color="primary" />
        <Typography variant="h4" fontWeight="bold">
          Settings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Phone Verification Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <PhoneIcon color="primary" />
            <Typography variant="h6">Phone Verification</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <FormControlLabel
            control={
              <Switch
                checked={settings.phoneVerificationRequired}
                onChange={(e) => handleChange("phoneVerificationRequired", e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography fontWeight="medium">
                  Require phone verification for orders
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  When enabled, customers must verify their phone number before placing orders
                </Typography>
              </Box>
            }
            sx={{ alignItems: "flex-start", ml: 0 }}
          />

          <Box mt={2}>
            <Chip
              label={settings.phoneVerificationRequired ? "ENABLED" : "DISABLED"}
              color={settings.phoneVerificationRequired ? "success" : "default"}
              size="small"
            />
          </Box>
        </CardContent>
      </Card>

      {/* OTP Provider Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <SmsIcon color="primary" />
            <Typography variant="h6">OTP Delivery Method</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 2 }}>
              How should OTP be sent to customers?
            </FormLabel>
            <RadioGroup
              value={settings.otpProvider}
              onChange={(e) => handleChange("otpProvider", e.target.value)}
            >
              <FormControlLabel
                value="EMAIL"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon fontSize="small" />
                    <Box>
                      <Typography fontWeight="medium">Email OTP</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Send OTP to customer's registered email address
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{ mb: 2, alignItems: "flex-start" }}
              />
              <FormControlLabel
                value="SMS"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <SmsIcon fontSize="small" />
                    <Box>
                      <Typography fontWeight="medium">SMS OTP (MSG91)</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Send OTP via SMS to customer's phone number
                      </Typography>
                      <Typography variant="caption" color="warning.main">
                        Requires MSG91 credentials configured on server
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{ alignItems: "flex-start" }}
              />
            </RadioGroup>
          </FormControl>

          <Box mt={3} p={2} bgcolor="grey.100" borderRadius={1}>
            <Typography variant="body2" color="text.secondary">
              <strong>Current:</strong>{" "}
              {settings.otpProvider === "SMS" ? (
                <>
                  SMS via MSG91 <SmsIcon fontSize="inherit" sx={{ verticalAlign: "middle" }} />
                </>
              ) : (
                <>
                  Email <EmailIcon fontSize="inherit" sx={{ verticalAlign: "middle" }} />
                </>
              )}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          size="large"
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
