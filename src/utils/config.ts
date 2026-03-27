import dotenv from 'dotenv';

dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://restful-booker.herokuapp.com',
  adminUsername: process.env.ADMIN_USERNAME ?? 'admin',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'password123',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
