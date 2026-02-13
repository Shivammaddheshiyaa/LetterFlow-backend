const Address = require("../models/Address.model");
const Letter = require("../models/Letter.model");

exports.saveAddress = async (req, res) => {
  try {
    const { letterId, ...addressData } = req.body;

    if (!letterId) {
      return res.status(400).json({ message: "Letter ID required" });
    }

    // Check letter exists & belongs to user
    const letter = await Letter.findOne({
      _id: letterId,
      user: req.user.userId,
    });

    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    const address = await Address.create({
      letter: letterId,
      ...addressData,
    });

    res.status(201).json({
      message: "Address saved",
      address,
    });
  } catch (error) {
    console.error("Save address error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
