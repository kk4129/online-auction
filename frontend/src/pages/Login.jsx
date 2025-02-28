import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axiosInstance';
import { setToken } from '../utils/auth';
import { TextField, Button, Typography, Container, Box, Checkbox, FormControlLabel, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Validation Schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('api/auth/login', data);
      const token = response.data.token;
  
      if (token) {
        localStorage.setItem('authToken', token); // ✅ Store token
        setToken(token); // ✅ Set token in axios instance
        alert('Login successful!');
        navigate('/auctions');
      }
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box mt={5} mb={3} textAlign="center">
        <Typography variant="h4">Login</Typography>
      </Box>

      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)}>
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

        <FormControlLabel
          control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
          label="Remember Me"
        />

        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <Typography align="center" mt={2}>
        Don't have an account? <Button onClick={() => navigate('/signup')}>Signup</Button>
      </Typography>
    </Container>
  );
}

export default Login;
