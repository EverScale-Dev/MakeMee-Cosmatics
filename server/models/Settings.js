const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// Static method to get a setting
settingsSchema.statics.get = async function (key, defaultValue = null) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Static method to set a setting
settingsSchema.statics.set = async function (key, value, description = null) {
  const update = { value };
  if (description) update.description = description;

  return this.findOneAndUpdate(
    { key },
    update,
    { upsert: true, new: true }
  );
};

// Default settings initialization
settingsSchema.statics.initDefaults = async function () {
  const defaults = [
    {
      key: "phoneVerificationRequired",
      value: false,
      description: "Require phone verification before placing orders",
    },
    {
      key: "otpProvider",
      value: "EMAIL", // EMAIL or SMS
      description: "OTP delivery method: EMAIL (temporary) or SMS (MSG91)",
    },
    {
      key: "codEnabled",
      value: true,
      description: "Enable Cash on Delivery payment option",
    },
  ];

  for (const setting of defaults) {
    await this.findOneAndUpdate(
      { key: setting.key },
      { $setOnInsert: setting },
      { upsert: true }
    );
  }
};

module.exports = mongoose.model("Settings", settingsSchema);
