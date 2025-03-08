import React from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import { Gavel, Security, AccessTime, AttachMoney, Star } from "@mui/icons-material";

const features = [
  { icon: <Gavel fontSize="large" />, title: "Live Bidding", desc: "Participate in real-time auctions from anywhere." },
  { icon: <Security fontSize="large" />, title: "Secure Transactions", desc: "We ensure 100% secure payments and transactions." },
  { icon: <AccessTime fontSize="large" />, title: "Timed Auctions", desc: "Bid within the auction timeframe and win amazing deals." },
  { icon: <AttachMoney fontSize="large" />, title: "Best Deals", desc: "Find the best prices and exclusive auction deals." },
  { icon: <Star fontSize="large" />, title: "User-Friendly UI", desc: "Easy-to-use platform for seamless auction experiences." }
];

const AboutUs = () => {
  return (
    <>
      
      <Container maxWidth="lg" sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
          About Online Auction
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Welcome to Online Auction, your go-to platform for bidding on a variety of items securely and efficiently.
          Join thousands of users who trust us for real-time auctions, seamless transactions, and the best deals!
        </Typography>

        {/* Features Section */}
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ textAlign: "center", p: 3, boxShadow: 3, borderRadius: 3 }}>
                {feature.icon}
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default AboutUs;
