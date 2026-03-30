import dotenv from 'dotenv';

// I load environment variables once here so every service reads the same source of truth.
dotenv.config();

export const config = {
  // I keep safe defaults to avoid crashing locally when a .env value is missing.
  baseUrl: process.env.BASE_URL ?? 'https://restful-booker.herokuapp.com',
  adminUsername: process.env.ADMIN_USERNAME ?? 'admin',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'password123',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
