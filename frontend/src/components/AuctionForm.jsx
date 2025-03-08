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
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const auctionData = new FormData();
      auctionData.append('title', formData.title);
      auctionData.append('description', formData.description);
      auctionData.append('startingPrice', formData.startingPrice);
      auctionData.append('endDate', new Date(formData.endDate).toISOString());
      if (image) {
        auctionData.append('image', image);
      }

      const response = await axios.post('/api/auctions', auctionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Auction created:', response.data);
      onAuctionCreated(response.data);
      setFormData({ title: '', description: '', startingPrice: '', endDate: '' });
      setImage(null);
    } catch (error) {
      console.error('Error creating auction:', error);
      if (error.response) {
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
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} encType="multipart/form-data">
        <TextField label="Title" name="title" value={formData.title} onChange={handleChange} required />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} required multiline rows={3} />
        <TextField label="Starting Price" name="startingPrice" type="number" value={formData.startingPrice} onChange={handleChange} required />
        <TextField label="End Date" name="endDate" type="datetime-local" value={formData.endDate} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Auction'}
        </Button>
      </Box>
    </Container>
  );
};

export default AuctionForm;
