import axios from "axios";


const API = axios.create({
   baseURL: process.env.DOMAIN || 'http://localhost:3000',
    withCredentials: true,
});

export default API;