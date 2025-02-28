import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { Container, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';

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
        alert('You must log in to view this page.');
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
        `/api/auctions/${id}/bid`, // Update the route to match backend fix
        { bidAmount: Number(bidAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Bid placed successfully!");
  
      // ✅ Instead of re-fetching auction details, update state immediately
      setAuction(response.data.auction);
      setHighestBidderName("You"); // Update UI optimistically
      setBidAmount("");
  
    } catch (err) {
      console.error("Error placing bid:", err);
      setError(err.response?.data?.message || "Failed to place bid.");
    } finally {
      setPlacingBid(false);
    }
  };
  

  if (loading) return <CircularProgress />;
  if (!auction) return <Typography>Loading auction details...</Typography>;

  return (
    <Container>
      <Typography variant="h4">{auction.title}</Typography>
      <Typography>Description: {auction.description}</Typography>
      <Typography>Starting Price: ${auction.startingPrice}</Typography>
      <p>Current Bid: ${auction?.currentBid || "No bids yet"}</p>
      <p>Highest Bidder: {auction?.highestBidder || "No bids yet"}</p>


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
        <Button type="submit" variant="contained" color="primary" disabled={placingBid}>
          {placingBid ? 'Placing Bid...' : 'Place Bid'}
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Container>
  );
};

export default AuctionDetails;
