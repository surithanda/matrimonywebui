import axios from 'axios';

// Create axios instance with default config
export const api = axios.create({
  baseURL: "http://localhost:8080/api", 
  headers: {
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
      'Content-Type': 'application/json',
    },
});