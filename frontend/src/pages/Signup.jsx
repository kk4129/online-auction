import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axiosInstance';
import { setToken } from '../utils/auth';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
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

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('api/auth/signup', data);
      setToken(response.data.token);
      alert('Signup successful!');
      navigate('/auctions');
    } catch (error) {
      alert('Signup failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} mb={3}>
        <Typography variant="h4" align="center">Signup</Typography>
      </Box>
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Signup
        </Button>
      </form>
      <Typography align="center" mt={2}>
        Already have an account? <Button onClick={() => navigate('/login')}>Login</Button>
      </Typography>
    </Container>
  );
}

export default Signup;
