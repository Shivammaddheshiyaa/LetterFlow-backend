const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const User = require("../models/User.model");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

module.exports = router;
