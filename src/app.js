// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware.js';
import { HTTP_STATUS } from './constants/index.js';
import { sendError } from './utils/response.js';
import visitRoutes from './routes/visit.routes.js';
import userRoutes from './routes/user.routes.js';
import reportRoutes from './routes/report.routes.js';
import authRoutes from './routes/auth.routes.js';
const app = express();

// 1. Global Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(cors({ origin: '*', credentials: true })); // Handle CORS (Adjust for production later)
app.use(morgan('dev')); // HTTP request logging
app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ extended: true })); // URL encoded parsing
app.use(cookieParser()); // Parse cookie headers

// 2. Base Health Check Route
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({ status: 'UP', timestamp: new Date() });
});

// Mount Authentication Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
// 3. Fallback Route for Undefined Paths (404)
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = HTTP_STATUS.NOT_FOUND;
  next(error);
});

// 4. Centralized Error Handling Middleware
app.use(errorHandler);

export default app;