const Review = require("../../models/Review");

// Add Review (user)
exports.addReview = async (req, res) => {
  try {
    const { name, rating, message, productId } = req.body;

    if (!name || !rating || !message || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const review = await Review.create({
      name,
      rating,
      message,
      productId,
      isApproved: false, // admin must approve
    });

    res.status(201).json({
      success: true,
      message: "Review submitted. Pending approval.",
      data: review,
    });
  } catch (err) {
    console.error("Review Add Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Approved Reviews (frontend)
exports.getApprovedReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      productId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error("Review Fetch Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADMIN – Get All Reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADMIN – Approve Review
exports.approveReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Review Approved", data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADMIN – Delete Review
exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
