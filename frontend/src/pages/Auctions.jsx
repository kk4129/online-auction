import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';
import { Grid, Container, Typography } from '@mui/material';

function Auctions() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    axios.get('/auctions')
      .then(response => setAuctions(response.data))
      .catch(error => console.error('Error fetching auctions:', error));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Live Auctions</Typography>
      <Grid container spacing={3}>
        {auctions.map(auction => (
          <Grid item key={auction._id} xs={12} sm={6} md={4}>
            <ProductCard auction={auction} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Auctions;
