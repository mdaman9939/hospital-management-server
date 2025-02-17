const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");
const rateLimit = require("express-rate-limit");
const Register = require("../schema/Register");

const router = express.Router();

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
});

// Register route
// Register route with immediate JWT generation
router.post("/registers", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Register({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate token and refresh token immediately
    const jwtSecret = process.env.JWT_SECRET || "secretKey";
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.REFRESH_SECRET || "refreshSecretKey",
      { expiresIn: "7d" }
    );

    // Save the refresh token to the database
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully!",
      token,
      refreshToken,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// Login route with rate limiter
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const jwtSecret = process.env.JWT_SECRET || "secretKey";
    const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      "refreshSecretKey",
      { expiresIn: "7d" }
    );

    // Save refresh token to the database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email }, // Send user data
    });
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

module.exports = router;
