const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createLetter,
  getMyLetters,
  addAddressToLetter,
  getLetterById,
} = require("../controllers/letter.controller");

// 🔐 Protected routes
router.post("/", authMiddleware, createLetter);
router.get("/my", authMiddleware, getMyLetters);
router.put("/:id/address", authMiddleware, addAddressToLetter);
router.get("/:id", authMiddleware, getLetterById);


// 🔐 Get logged-in user's letters
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const letters = await Letter.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ letters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch letters" });
  }
});


module.exports = router;
