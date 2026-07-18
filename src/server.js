// src/server.js
import app from './app.js';
import pool from './config/db.js'; // Ensures database test runs on startup
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections outside Express context
process.on('unhandledRejection', (err) => {
  console.error(`🚨 Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});