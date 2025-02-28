const express = require("express");
const router = express.Router();
const Bid = require("../models/Bid");
const Auction = require("../models/Auction");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Place a bid
router.post("/place-bid", authMiddleware, async (req, res) => {
  try {
    const { auctionId, amount } = req.body;

    if (!auctionId || !amount) {
      return res.status(400).json({ message: "Auction ID and amount are required." });
    }

    const newBid = new Bid({
      userId: req.user.id, // Ensure `req.user.id` is correctly set by authMiddleware
      auctionId,
      amount,
      status: "Pending", // Default status (will be updated later)
    });

    await newBid.save();
    res.status(201).json({ message: "Bid placed successfully", bid: newBid });

  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch user's bid history
router.get("/my-bids", authMiddleware, async (req, res) => {
  try {
    const userBids = await Bid.find({ userId: req.user.id }).populate("auctionId", "title");

    const bidHistory = userBids.map((bid) => ({
      _id: bid._id,
      auctionTitle: bid.auctionId ? bid.auctionId.title : "Auction Removed",
      amount: bid.amount,
      status: bid.status, // Updated field (Won/Lost/Pending)
    }));

    res.json(bidHistory);
  } catch (error) {
    console.error("Error fetching bid history:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Process completed auctions (Determine winners)
router.post("/process-completed-auctions", async (req, res) => {
  try {
    const endedAuctions = await Auction.find({ endDate: { $lt: new Date() }, status: "active" });

    for (const auction of endedAuctions) {
      // Find the highest bid for the auction
      const highestBid = await Bid.findOne({ auctionId: auction._id }).sort({ amount: -1 });

      if (highestBid) {
        // ✅ Update the highest bidder's status to "Won"
        await Bid.updateOne({ _id: highestBid._id }, { $set: { status: "Won" } });

        // ✅ Update all other bidders' status to "Lost"
        await Bid.updateMany(
          { auctionId: auction._id, _id: { $ne: highestBid._id } },
          { $set: { status: "Lost" } }
        );

        // ✅ Mark auction as completed & store the winner
        await Auction.updateOne({ _id: auction._id }, { $set: { status: "completed", winner: highestBid.userId } });
      }
    }

    res.json({ message: "Auction processing completed." });
  } catch (error) {
    console.error("Error processing auctions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
