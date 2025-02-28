import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const AuctionForm = ({ onAuctionCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.post('/api/auctions', {
        title: formData.title,
        description: formData.description,
        startingPrice: Number(formData.startingPrice),
        endDate: new Date(formData.endDate).toISOString(),
      });
      
  
      console.log('Auction created:', response.data);
      onAuctionCreated(response.data);
      setFormData({ title: '', description: '', startingPrice: '', endDate: '' });
    } catch (error) {
      console.error('Error creating auction:', error);
  
      if (error.response) {
        console.error('Response Data:', error.response.data);
        setError(error.response.data.message || 'Failed to create auction.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
    
  

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>Create New Auction</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Title" name="title" value={formData.title} onChange={handleChange} required />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} required multiline rows={3} />
        <TextField label="Starting Price" name="startingPrice" type="number" value={formData.startingPrice} onChange={handleChange} required />
        <TextField label="End Date" name="endDate" type="datetime-local" value={formData.endDate} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Auction'}
        </Button>
      </Box>
    </Container>
  );
};

export default AuctionForm;
