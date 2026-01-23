const Banner = require("../../models/Banner");

// @desc    Get active banners by location (public)
// @route   GET /api/banners/:location
// @access  Public
exports.getBannersByLocation = async (req, res) => {
  try {
    const { location } = req.params;

    if (!["home", "shop"].includes(location)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location. Use 'home' or 'shop'",
      });
    }

    const banners = await Banner.find({ location, isActive: true })
      .sort({ order: 1 })
      .select("title desktopImage mobileImage link");

    res.status(200).json({ success: true, banners });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get all banners (admin)
// @route   GET /api/banners/admin/all
// @access  Admin
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ location: 1, order: 1 });
    res.status(200).json({ success: true, banners });
  } catch (error) {
    console.error("Error fetching all banners:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Create banner (admin)
// @route   POST /api/banners
// @access  Admin
exports.createBanner = async (req, res) => {
  try {
    const { title, location, desktopImage, mobileImage, link, order, isActive } = req.body;

    if (!title || !location || !desktopImage || !mobileImage) {
      return res.status(400).json({
        success: false,
        message: "Title, location, desktopImage, and mobileImage are required",
      });
    }

    const banner = await Banner.create({
      title,
      location,
      desktopImage,
      mobileImage,
      link: link || "",
      order: order || 0,
      isActive: isActive !== false,
    });

    res.status(201).json({ success: true, banner });
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update banner (admin)
// @route   PUT /api/banners/:id
// @access  Admin
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({ success: true, banner });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete banner (admin)
// @route   DELETE /api/banners/:id
// @access  Admin
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({ success: true, message: "Banner deleted" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Toggle banner active status (admin)
// @route   PATCH /api/banners/:id/toggle
// @access  Admin
exports.toggleBannerStatus = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.status(200).json({ success: true, banner });
  } catch (error) {
    console.error("Error toggling banner status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
