const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminProtect");

const {
  addReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  deleteReview,
} = require("../controllers/reviewController");

// USER (public)
router.post("/", addReview);
router.get("/:productId", getApprovedReviews);

// ADMIN (protected)
router.get("/admin/all", adminProtect, getAllReviews);
router.put("/admin/approve/:id", adminProtect, approveReview);
router.delete("/admin/delete/:id", adminProtect, deleteReview);

module.exports = router;
