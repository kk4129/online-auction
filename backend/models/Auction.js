const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  highestBidder: { type: String, default: null }, // ✅ Ensure it's a String, not ObjectId
  endTime: { type: Date, required: true },
  processed: { type: Boolean, default: false },
  image: {type:String},
});

module.exports = mongoose.model("Auction", auctionSchema);
