import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Adjust if your backend is hosted elsewhere
});

// Attach token to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Get token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
