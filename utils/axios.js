import axios from 'axios';

const API = axios.create({
  baseURL: process.env.DOMAIN_API || 'http://localhost:3000/api',
  withCredentials: true,
});

export default API;
