import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';
import { Grid, Container, Typography, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('api/auctions');
      setAuctions(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setError('Failed to load auctions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <p>

      </p>

      <Typography variant="h4" gutterBottom>Live Auctions</Typography>
      
       
      <p>
        
      </p> 

      {/* ✅ Display loading state */}
      {loading && <CircularProgress />}

      {/* ✅ Display error message */}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {auctions.length === 0 && !loading ? (
          <Typography>No auctions available</Typography>
        ) : (
          auctions.map(auction => (
            <Grid item key={auction._id} xs={12} sm={6} md={4}>
              <Link to={`/auction/${auction._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ProductCard auction={auction} />
              </Link>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default Auctions;
