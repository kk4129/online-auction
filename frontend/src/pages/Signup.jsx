import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axiosInstance';
import { setToken } from '../utils/auth';
import { TextField, Button, Typography, Container, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Validation Schema
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('api/auth/signup', data);
      setToken(response.data.token);
      setSuccessMessage('Signup successful! Redirecting...');
      setTimeout(() => navigate('/auctions'), 2000); // Redirect after 2 seconds
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} mb={3} textAlign="center">
        <Typography variant="h4" fontWeight="bold" color="primary">Signup</Typography>
      </Box>

      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Box sx={{ p: 4, boxShadow: 3, borderRadius: 3, bgcolor: 'white' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 3, py: 1.5, fontSize: '16px' }} 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Signup'}
          </Button>
        </form>
      </Box>

      <Typography align="center" mt={2}>
        Already have an account? <Button onClick={() => navigate('/login')}>Login</Button>
      </Typography>
    </Container>
  );
}

export default Signup;
