const receiveMail = require('../../utils/receiveMail');

exports.contactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    await receiveMail({ name, email, subject, message });

    res.status(200).json({
      success: true,
      message: "Message received successfully",
    });

  } catch (error) {
    console.log("Contact form error:", error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
};
