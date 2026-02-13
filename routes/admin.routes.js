const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const Letter = require("../models/Letter.model");

// ✅ Get all orders
router.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const letters = await Letter.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ letters });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ Update order status
router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const updated = await Letter.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      res.json({ letter: updated });
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  }
);

module.exports = router;
