const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Auction = require("../models/Auction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate Inputs
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if User Already Exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create New User
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: newUser._id, username, email },
    });

  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate Inputs
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find User by Email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ GET LOGGED-IN USER DETAILS
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Fetch User Details without Password
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ FETCH LIVE AUCTIONS
router.get("/live", async (req, res) => {
  try {
    const liveAuctions = await Auction.find({ status: "live" });
    res.status(200).json(liveAuctions);
  } catch (error) {
    console.error("Error fetching live auctions:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
