// src/pages/LiveAuctions.jsx
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Typography, Box, Grid, Card, CardContent } from '@mui/material';

function LiveAuctions() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get('/auctions/live');
        setAuctions(response.data);
      } catch (error) {
        console.error('Failed to fetch live auctions:', error.response?.data || error.message);
      }
    };
    fetchAuctions();
  }, []);

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom>
        Live Auctions
      </Typography>
      <Grid container spacing={3}>
        {auctions.length > 0 ? (
          auctions.map((auction) => (
            <Grid item key={auction._id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{auction.title}</Typography>
                  <Typography color="textSecondary">Starting Price: ${auction.startingPrice}</Typography>
                  <Typography color="textSecondary">Ends On: {new Date(auction.endTime).toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography align="center" style={{ width: '100%' }}>
            No live auctions available
          </Typography>
        )}
      </Grid>
    </Box>
  );
}

export default LiveAuctions;
