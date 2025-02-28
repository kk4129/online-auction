const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require("node-cron");
const axios = require("axios");

// Run every minute to process completed auctions
//cron.schedule("*/1 * * * *", async () => {
  //try {
    //console.log("⏳ Running auction processing...");
    //const response = await axios.post("http://localhost:5000/api/bids/process-completed-auctions");
    //console.log("✅ Auction processing completed:", response.data.message);
  //} catch (error) {
    //console.error("❌ Error processing auctions:", error.response ? error.response.data : error.message);
  //}
//});


dotenv.config();
const app = express();

// ✅ CORS Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend requests
  credentials: true,
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// ✅ JSON Middleware
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
  });

// ✅ Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); 
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes'); // ✅ Added bid routes

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes); // ✅ Register bid routes

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));