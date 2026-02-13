const Letter = require("../models/Letter.model");

/* ================= CREATE LETTER (DRAFT) ================= */
exports.createLetter = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Letter content is required" });
    }

    const letter = await Letter.create({
      user: req.user.id,
      content,
      status: "draft",
    });

    res.status(201).json({
      message: "Letter saved as draft",
      letter,
    });

  } catch (error) {
    console.error("🔥 CREATE LETTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET MY LETTERS ================= */
exports.getMyLetters = async (req, res) => {
  try {
    const letters = await Letter.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: letters.length,
      letters,
    });

  } catch (error) {
    console.error("🔥 FETCH LETTERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= ADD ADDRESS TO LETTER ================= */
exports.addAddressToLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const address = req.body;

    if (!address.name || !address.street || !address.city || !address.postalCode) {
      return res.status(400).json({ message: "Incomplete address" });
    }

    // 🔥 FIX: removed isDeleted filter
    const letter = await Letter.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    letter.address = address;
    letter.status = "address_added";

    await letter.save();

    res.status(200).json({
      message: "Address added successfully",
      letter,
    });

  } catch (error) {
    console.error("🔥 ADD ADDRESS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET LETTER BY ID ================= */
exports.getLetterById = async (req, res) => {
  try {
    const { id } = req.params;

    const letter = await Letter.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    res.status(200).json({ letter });
  } catch (error) {
    console.error("Get letter error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
