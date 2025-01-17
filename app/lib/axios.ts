import axios from 'axios';

// Create axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, 
  headers: {
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
      'Content-Type': 'application/json',
    },
});