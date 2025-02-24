// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Make sure this matches your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Add if using cookies for authentication
});

export default axiosInstance;
