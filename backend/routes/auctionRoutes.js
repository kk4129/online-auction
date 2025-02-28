const express = require("express");
const router = express.Router();
const Auction = require("../models/Auction");
const User = require("../models/User");
const Bid = require("../models/Bid"); // Import Bid model
const authenticateUser = require("../middleware/authMiddleware");

// ✅ Fetch all auctions
router.get("/", async (req, res) => {
  try {
    const auctions = await Auction.find();
    res.status(200).json(auctions);
  } catch (error) {
    console.error("❌ Error fetching auctions:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Fetch a single auction by ID
router.get("/:id", async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create a new auction
router.post("/", async (req, res) => {
  try {
    console.log("📌 Received auction creation request:", req.body);
    const { title, description, startingPrice, endDate } = req.body;

    if (!title || !description || !startingPrice || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAuction = new Auction({
      title,
      description,
      startingPrice: Number(startingPrice),
      currentBid: Number(startingPrice),
      highestBidder: null,
      endTime: new Date(endDate),
    });

    await newAuction.save();
    console.log("✅ Auction created successfully:", newAuction);
    res.status(201).json(newAuction);
  } catch (error) {
    console.error("❌ Auction creation error:", error);
    res.status(500).json({ message: "Error creating auction", error: error.message });
  }
});

// ✅ Place a bid (Requires authentication)
// ✅ Place a bid (Requires authentication)
router.post("/:id/bid", authenticateUser, async (req, res) => {
  try {
    const { bidAmount } = req.body;
    const userId = req.user.id; // Get authenticated user ID

    let auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (!bidAmount || bidAmount <= auction.currentBid) {
      return res.status(400).json({ message: "Bid must be higher than the current bid" });
    }

    // ✅ Fetch the user by ID to get their name
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Save the bid in the Bid collection
    const newBid = new Bid({
      userId,
      auctionId: auction._id,
      amount: bidAmount,
      isWinning: false,
    });
    await newBid.save();

    // ✅ Update the Auction Document with highest bidder's name
    auction = await Auction.findByIdAndUpdate(
      req.params.id,
      {
        currentBid: bidAmount,
        highestBidder: user.username,  // ✅ Store highest bidder's name instead of ID
      },
      { new: true }
    );

    console.log(`✅ Highest Bidder Updated: ${user.name}`);  // Debugging log

    res.status(200).json({ message: "Bid placed successfully", auction });
  } catch (error) {
    console.error("❌ Error placing bid:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});






// ✅ Process completed auctions and update winners
router.post("/process-completed-auction", async (req, res) => {
  try {
    const now = new Date();
    const completedAuctions = await Auction.find({ endTime: { $lte: now }, processed: false });

    if (completedAuctions.length === 0) {
      return res.status(200).json({ message: "No completed auctions to process." });
    }

    for (const auction of completedAuctions) {
      if (auction.highestBidder) {
        // ✅ Update the winning bid in the Bid collection
        await Bid.updateMany(
          { auctionId: auction._id },
          { $set: { isWinning: false } } // Mark all bids as lost initially
        );

        await Bid.findOneAndUpdate(
          { auctionId: auction._id, userId: auction.highestBidder },
          { $set: { isWinning: true } } // Mark the highest bidder as the winner
        );

        console.log(`✅ Auction "${auction.title}" completed. Winner: ${auction.highestBidder}`);
      } else {
        console.log(`⚠️ Auction "${auction.title}" ended with no bids.`);
      }

      // ✅ Mark auction as processed
      auction.processed = true;
      await auction.save();
    }

    res.status(200).json({ message: "Completed auctions processed successfully." });
  } catch (error) {
    console.error("❌ Error processing completed auctions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
