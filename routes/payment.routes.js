const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const authMiddleware = require("../middleware/auth.middleware");
const Letter = require("../models/Letter.model");

const router = express.Router();

// 🔐 Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



/* =========================================================
   1️⃣ CREATE ORDER
   POST /api/payment/create-order
========================================================= */
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const options = {
      amount: Number(amount) * 100, // Razorpay uses paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);

  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      message: "Order creation failed",
      error: error.message,
    });
  }
});



/* =========================================================
   2️⃣ VERIFY PAYMENT
   POST /api/payment/verify
========================================================= */
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      letterId,
    } = req.body;

    // 🔎 Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !letterId
    ) {
      return res.status(400).json({
        message: "Missing required payment details",
      });
    }

    // 🔐 Generate expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // ❌ Signature mismatch
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    // 🔄 Update letter in database
    const updatedLetter = await Letter.findByIdAndUpdate(
      letterId,
      {
        status: "paid",
        paymentId: razorpay_payment_id,
        paidAt: new Date(),
      },
      { new: true }
    );

    if (!updatedLetter) {
      return res.status(404).json({
        message: "Letter not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      letter: updatedLetter,
    });

  } catch (error) {
    console.error("Payment Verification Error:", error);
    return res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
});

module.exports = router;
