const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ===================== SIGNUP ===================== */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,       // used in controllers
        role: user.role,    // admin check
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Send response (🔥 INCLUDE ROLE)
    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,   // ⭐ REQUIRED
      },
    });

  } catch (error) {
    console.error("🔥 SIGNUP ERROR:", error);
    return res.status(500).json({
      message: "Signup failed",
    });
  }
};


/* ===================== LOGIN ===================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Send response (🔥 INCLUDE ROLE)
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,   // ⭐ REQUIRED
      },
    });

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};
