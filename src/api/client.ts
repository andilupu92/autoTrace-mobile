import axios from 'axios';

// Create a single instance to use everywhere
const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:8080',
  timeout: 10000, // Abort request if it takes more than 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;