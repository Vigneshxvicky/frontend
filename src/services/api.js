import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api' // ensure this matches your backend port and route
});

export default api;