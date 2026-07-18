// src/config/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  queueLimit: 0
});

// Test the database connection immediately on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('🚀 Database connection established successfully.');
    connection.release(); // release back to the pool
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1); // Shutdown application if database is inaccessible
  }
})();

export default pool;