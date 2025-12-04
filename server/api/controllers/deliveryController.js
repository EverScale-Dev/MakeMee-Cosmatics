const DeliveryCharges = require("../../models/DeliveryCharges");

// GET Delivery Settings
const getDeliverySettings = async (req, res) => {
  try {
    const settings = await DeliveryCharges.findOne();
    return res.json({ success: true, settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE Delivery Settings
const updateDeliverySettings = async (req, res) => {
  try {
    const { freeDeliveryAbove, baseDeliveryCharge, extraCharge, active } = req.body;

    let settings = await DeliveryCharges.findOne();

    if (!settings) {
      settings = await DeliveryCharges.create({
        freeDeliveryAbove,
        baseDeliveryCharge,
        extraCharge,
        active,
      });
    } else {
      settings.freeDeliveryAbove = freeDeliveryAbove;
      settings.baseDeliveryCharge = baseDeliveryCharge;
      settings.extraCharge = extraCharge;
      settings.active = active;
      settings.updatedAt = Date.now();
      await settings.save();
    }

    res.json({ success: true, settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getDeliverySettings,
  updateDeliverySettings,
};
