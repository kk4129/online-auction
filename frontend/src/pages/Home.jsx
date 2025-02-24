import React from 'react';
import { Typography, Container } from '@mui/material';

function Home() {
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>Welcome to Online Auction Platform</Typography>
      <Typography variant="body1">
        Discover unique items and bid to win. Start your auction journey now!
      </Typography>
    </Container>
  );
}

export default Home;
