import axios from 'axios';

// AQUI você define o IP uma única vez
// Troque pelo seu IPv4 atual
const API_URL = 'https://projeto-zero.onrender.com'; 

const api = axios.create({
  baseURL: API_URL
});

export default api;