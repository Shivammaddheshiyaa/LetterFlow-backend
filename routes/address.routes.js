const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { saveAddress } = require("../controllers/address.controller");

router.post("/", authMiddleware, saveAddress);

module.exports = router;
