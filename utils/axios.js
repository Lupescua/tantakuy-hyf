import axios from 'axios';

const API = axios.create({
  baseURL: process.env.DOMAIN_API || '/api',
  withCredentials: true,
});

export default API;
