const express = require('express');
const User = require('../models/User'); // Assuming you have a User model
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get user details by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ username: user.username });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = req.body.username;
    await user.save();

    res.json({ message: "Username updated successfully", username: user.username });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
