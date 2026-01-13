const express = require("express");
const router = express.Router();

const {
  addReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  deleteReview,
} = require("../controllers/reviewController");

// USER
router.post("/", addReview);
router.get("/:productId", getApprovedReviews);

// ADMIN
router.get("/admin/all", getAllReviews);
router.put("/admin/approve/:id", approveReview);
router.delete("/admin/delete/:id", deleteReview);

module.exports = router;
