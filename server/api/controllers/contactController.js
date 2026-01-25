const receiveMail = require('../../utils/receiveMail');
const ContactSubmission = require('../../models/ContactSubmission');

// @desc    Submit contact form (public)
// @route   POST /api/contact
exports.contactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required" });
    }

    // Save to database
    await ContactSubmission.create({
      name,
      email,
      subject: subject || '',
      message
    });

    // Also send email notification
    try {
      await receiveMail({ name, email, subject: subject || 'Contact Form', message });
    } catch (emailError) {
      console.log("Email notification failed:", emailError);
      // Don't fail the request if email fails, submission is saved
    }

    res.status(200).json({
      success: true,
      message: "Message received successfully! We'll get back to you soon.",
    });

  } catch (error) {
    console.log("Contact form error:", error);
    res.status(500).json({ success: false, message: "Failed to submit form" });
  }
};

// @desc    Get all contact submissions (admin only)
// @route   GET /api/contact
exports.getAllSubmissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      ContactSubmission.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ContactSubmission.countDocuments()
    ]);

    res.json({
      success: true,
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
};

// @desc    Mark submission as read (admin only)
// @route   PATCH /api/contact/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const submission = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({ success: true, data: submission });
  } catch (error) {
    console.error('Error marking submission as read:', error);
    res.status(500).json({ message: 'Failed to update submission' });
  }
};

// @desc    Delete contact submission (admin only)
// @route   DELETE /api/contact/:id
exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await ContactSubmission.findByIdAndDelete(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({ success: true, message: 'Submission deleted' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ message: 'Failed to delete submission' });
  }
};

// @desc    Get unread count (admin only)
// @route   GET /api/contact/unread-count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await ContactSubmission.countDocuments({ isRead: false });
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Failed to get count' });
  }
};
