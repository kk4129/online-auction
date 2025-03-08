import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { 
  Container, Typography, TextField, Button, Box, 
  CircularProgress, Card, CardContent, CardMedia, Grid, Alert 
} from '@mui/material';
import { Gavel } from '@mui/icons-material';

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [highestBidderName, setHighestBidderName] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [placingBid, setPlacingBid] = useState(false);

  useEffect(() => {
    fetchAuctionDetails();
  }, []);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must log in to view this page.');
        navigate('/login');
        return;
      }

      const response = await axios.get(`/api/auctions/${id}`);
      setAuction(response.data);

      if (response.data.highestBidder) {
        const bidderResponse = await axios.get(`/api/users/${response.data.highestBidder}`);
        setHighestBidderName(bidderResponse.data.username);
      }
    } catch (err) {
      console.error('Error fetching auction details:', err);
      setError('Failed to load auction details.');
    } finally {
      setLoading(false);
    }
  };

  const placeBid = async () => {
    try {
      setPlacingBid(true);
      setError("");
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must log in to place a bid.");
        setPlacingBid(false);
        return;
      }
  
      if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= auction.currentBid) {
        setError("Your bid must be higher than the current bid.");
        setPlacingBid(false);
        return;
      }
  
      const response = await axios.post(
        `/api/auctions/${id}/bid`, 
        { bidAmount: Number(bidAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setAuction(response.data.auction);
      setHighestBidderName("You"); 
      setBidAmount("");
  
    } catch (err) {
      console.error("Error placing bid:", err);
      setError(err.response?.data?.message || "Failed to place bid.");
    } finally {
      setPlacingBid(false);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '50px auto' }} />;
  if (!auction) return <Typography align="center">Loading auction details...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <CardMedia
              component="img"
              height="500"
              image="/images/bun.jpg"
              alt={auction.title}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">
                {auction.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {auction.description}
              </Typography>

              <Box sx={{ mt: 2, p: 2, border: "2px solid #1976D2", borderRadius: 2 }}>
                <Typography variant="h6">
                  <Gavel /> Starting Price: <strong>${auction.startingPrice}</strong>
                </Typography>
                <Typography variant="h6">
                  <Gavel /> Current Bid: <strong style={{ color: "green" }}>${auction.currentBid || "No bids yet"}</strong>
                </Typography>
                <Typography variant="h6">
                  Highest Bidder: <strong>{auction?.highestBidder || "No bids yet"}</strong>
                </Typography>
              </Box>

              <Box component="form" onSubmit={(e) => { e.preventDefault(); placeBid(); }} sx={{ mt: 3 }}>
                <TextField
                  label="Your Bid"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  disabled={placingBid} 
                  fullWidth
                >
                  {placingBid ? 'Placing Bid...' : 'Place Your Bid'}
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default AuctionDetails;
