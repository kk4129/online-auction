import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Countdown Timer Logic
const getRemainingTime = (endTime) => {
  const total = Date.parse(endTime) - Date.now();
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { total, hours, minutes, seconds };
};

function Home() {
  const navigate = useNavigate();
  const auctionEndTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

  const [timeLeft, setTimeLeft] = useState(getRemainingTime(auctionEndTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getRemainingTime(auctionEndTime));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Box
  sx={{
    position: "relative",
    backgroundImage: "url(/images/back.jpg)", // Adjust path as needed
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    textAlign: "center",
    py: 10,
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Black overlay with 50% transparency
      zIndex: 1,
    },
  }}
>
  {/* Content */}
  <Box sx={{ position: "relative", zIndex: 2 }}>
    <Typography
      variant="h2"
      fontWeight="bold"
      sx={{ fontSize: "3rem", textTransform: "uppercase" }}
    >
      Place Your Bids, <span style={{ color: "#FFD700" }}>Win Big!</span>
    </Typography>
    <Typography variant="h6" sx={{ mt: 2, fontSize: "1.5rem" }}>
      Join the most thrilling online auctions. Find rare collectibles, electronics, art, and more!
    </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 3, px: 4, py: 1.5, fontSize: "1.2rem", fontWeight: "bold" }}
          onClick={() => navigate("/auctions")}
        >
          🔥 Start Bidding Now!
        </Button>
      </Box>
    </Box>

      {/* Live Auction Countdown */}
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: "2rem" }}>
          ⏳ <span style={{ color: "#d32f2f" }}>Live Auction Ends In:</span>  
          {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
        </Typography>
      </Box>

      {/* Trending Auctions */}
      <Container sx={{ mt: 5 }}>
        <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ mb: 3, textDecoration: "underline" }}>
          🚀 Trending Auctions
        </Typography>
        <Grid container spacing={3}>
          {[
            { title: "Rolex Submariner", price: "$5,200", img: "/images/rolex.jpg" },
            { title: "Vintage Painting", price: "$3,100", img: "/images/paint.jpg" },
            { title: "Gaming Laptop", price: "$1,800", img: "/images/laptop.jpeg" },
          ].map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card sx={{ boxShadow: 3 }}>
                <CardMedia component="img" height="200" image={item.img} alt={item.title} />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h5" fontWeight="bold">{item.title}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Current Bid: <strong>{item.price}</strong>
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, fontWeight: "bold" }}
                    onClick={() => navigate("/auctions")}
                  >
                    💰 Place a Bid
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why Choose Us Section */}
      <Container sx={{ mt: 6 }}>
        <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ mb: 3, color: "#ff9800" }}>
          🏆 Why Choose Our Platform?
        </Typography>
        <Grid container spacing={4} textAlign="center">
          {[
            { title: "🔒 Secure Payments", desc: "100% safe transactions with encryption" },
            { title: "🛡️ Verified Sellers", desc: "Trusted and verified auctioneers" },
            { title: "🔔 Instant Alerts", desc: "Get notified when someone outbids you" },
          ].map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "#f9f9f9" }}>
                <Typography variant="h5" fontWeight="bold">{feature.title}</Typography>
                <Typography variant="body1">{feature.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box sx={{ mt: 6, py: 5, bgcolor: "#1976D2", color: "white", textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold">
          🎯 Start Bidding Today!
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          Sign up and get access to thousands of live auctions.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2, px: 4, py: 1.5, fontWeight: "bold", fontSize: "1.2rem" }}
          onClick={() => navigate("/signup")}
        >
          🚀 Create an Account
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 5, py: 3, bgcolor: "#333", color: "white", textAlign: "center" }}>
        <Typography variant="body1" fontWeight="bold">
          © 2025 Online Auction Platform | Contact: <span style={{ color: "#FFD700" }}>support@auction.com</span>
        </Typography>
      </Box>
    </>
  );
}

export default Home;
