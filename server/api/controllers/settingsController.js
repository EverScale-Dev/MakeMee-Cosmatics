const Settings = require("../../models/Settings");

// Get all settings (admin only)
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Settings.find({});

    // Convert to key-value object for easier frontend use
    const settingsObj = {};
    settings.forEach((s) => {
      settingsObj[s.key] = {
        value: s.value,
        description: s.description,
      };
    });

    res.status(200).json(settingsObj);
  } catch (error) {
    console.error("Error fetching settings:", error.message);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

// Get a single setting by key
exports.getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const value = await Settings.get(key);

    if (value === null) {
      return res.status(404).json({ message: "Setting not found" });
    }

    res.status(200).json({ key, value });
  } catch (error) {
    console.error("Error fetching setting:", error.message);
    res.status(500).json({ message: "Failed to fetch setting" });
  }
};

// Update a setting (admin only)
exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ message: "Value is required" });
    }

    // Validate specific settings
    if (key === "otpProvider" && !["EMAIL", "SMS"].includes(value)) {
      return res.status(400).json({ message: "OTP provider must be EMAIL or SMS" });
    }

    if (key === "phoneVerificationRequired" && typeof value !== "boolean") {
      return res.status(400).json({ message: "Phone verification must be true or false" });
    }

    const setting = await Settings.set(key, value);
    res.status(200).json({ key: setting.key, value: setting.value });
  } catch (error) {
    console.error("Error updating setting:", error.message);
    res.status(500).json({ message: "Failed to update setting" });
  }
};

// Update multiple settings at once (admin only)
exports.updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ message: "Settings object required" });
    }

    const results = {};
    for (const [key, value] of Object.entries(settings)) {
      // Validate specific settings
      if (key === "otpProvider" && !["EMAIL", "SMS"].includes(value)) {
        return res.status(400).json({ message: "OTP provider must be EMAIL or SMS" });
      }
      if (key === "phoneVerificationRequired" && typeof value !== "boolean") {
        return res.status(400).json({ message: "Phone verification must be true or false" });
      }

      const setting = await Settings.set(key, value);
      results[key] = setting.value;
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error updating settings:", error.message);
    res.status(500).json({ message: "Failed to update settings" });
  }
};

// Initialize default settings (called on server start)
exports.initializeSettings = async () => {
  try {
    await Settings.initDefaults();
    console.log("Settings initialized");
  } catch (error) {
    console.error("Error initializing settings:", error.message);
  }
};

// Get public settings (no auth required)
// Only exposes settings that frontend needs
exports.getPublicSettings = async (req, res) => {
  try {
    const phoneVerificationRequired = await Settings.get("phoneVerificationRequired", false);

    res.status(200).json({
      phoneVerificationRequired,
    });
  } catch (error) {
    console.error("Error fetching public settings:", error.message);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};
