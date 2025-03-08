const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { ObjectId } = require("mongoose").Types;
const router = express.Router();
const Auction = require("../models/Auction");
const User = require("../models/User");
const Bid = require("../models/Bid");
const authenticateUser = require("../middleware/authMiddleware");

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Fetch all auctions
router.get("/", async (req, res) => {
  try {
    const auctions = await Auction.find();
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Fetch a single auction by ID
router.get("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid auction ID" });
    }

    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a new auction with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, startingPrice, endDate } = req.body;
    if (!title || !description || !startingPrice || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newAuction = new Auction({
      title,
      description,
      startingPrice: Number(startingPrice),
      currentBid: Number(startingPrice),
      highestBidder: null,
      endTime: new Date(endDate),
      image: imageUrl,
      processed: false, // Ensures processing only happens once
    });

    await newAuction.save();
    res.status(201).json(newAuction);
  } catch (error) {
    res.status(500).json({ message: "Error creating auction", error: error.message });
  }
});

// Place a bid
router.post("/:id/bid", authenticateUser, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid auction ID" });
    }

    const { bidAmount } = req.body;
    const userId = req.user.id;

    let auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (!bidAmount || bidAmount <= auction.currentBid) {
      return res.status(400).json({ message: "Bid must be higher than the current bid" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newBid = new Bid({
      userId,
      auctionId: auction._id,
      amount: bidAmount,
      isWinning: false,
    });

    await newBid.save();

    auction = await Auction.findByIdAndUpdate(
      req.params.id,
      { currentBid: bidAmount, highestBidder: user.username },
      { new: true }
    );

    res.status(200).json({ message: "Bid placed successfully", auction });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Process completed auctions
router.post("/process-completed-auction", async (req, res) => {
  try {
    const now = new Date();
    const completedAuctions = await Auction.find({ endTime: { $lte: now }, processed: false });

    for (const auction of completedAuctions) {
      if (auction.highestBidder) {
        // Find the highest bidder's user ID
        const highestBidderUser = await User.findOne({ username: auction.highestBidder });

        if (highestBidderUser) {
          await Bid.updateMany({ auctionId: auction._id }, { $set: { isWinning: false } });

          await Bid.findOneAndUpdate(
            { auctionId: auction._id, userId: highestBidderUser._id },
            { $set: { isWinning: true } }
          );
        }
      }
      auction.processed = true;
      await auction.save();
    }

    res.status(200).json({ message: "Completed auctions processed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
