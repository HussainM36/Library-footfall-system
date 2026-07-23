// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'; // Added missing import to prevent application crash
import analyticsRoutes from './routes/analytics.routes.js';
// Import Global Error Utilities & Constants
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { HTTP_STATUS } from './constants/index.js';

// Import Route Handlers
import authRoutes from './routes/auth.routes.js';
import visitRoutes from './routes/visit.routes.js';
import userRoutes from './routes/user.routes.js';
import reportRoutes from './routes/report.routes.js';
import backupRoutes from './routes/backupRoutes.js';
// Initialize environment configuration parameters
dotenv.config();

const app = express();

// ==========================================
// 1. Global Middlewares
// ==========================================
app.use(helmet()); // Secure HTTP headers
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true })); // Cross-Origin configuration
app.use(morgan('dev')); // HTTP request logging
app.use(express.json()); // JSON body parsing
app.use(express.urlencoded({ extended: true })); // URL encoded payload parsing
app.use(cookieParser()); // Parse signed/unsigned cookie headers

// ==========================================
// 2. Base Health Check Route
// ==========================================
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({ status: 'UP', timestamp: new Date() });
});

// ==========================================
// 3. API Route Registrations
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/backups', backupRoutes);
app.use('/api/system', backupRoutes);
// ==========================================
// 4. Fallback & Exception Middleware Handling
// ==========================================
// Handle dead route requests via your custom middleware handler
app.use(notFoundHandler);

// Centralized error interceptor handling (Must remain as the absolute final route declaration)
app.use(errorHandler);

export default app;