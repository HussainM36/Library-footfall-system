// src/middleware/error.middleware.js
import { HTTP_STATUS } from '../constants/index.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`[SYSTEM ERROR] ❌ Time: ${new Date().toISOString()} | Path: ${req.path}`);
  console.error(err.stack);

  // Default fallback status properties
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'An internal server error occurred processing your request.';
  let errors = err.errors || null;

  // Handle common MySQL / Database specific crashes gracefully
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Data conflict detected. A record with this unique attribute already exists.';
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Foreign key constraint failed. Related master record entry was not found.';
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

/**
 * Handle 404 / Missing Route requests
 */
export const notFoundHandler = (req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `The requested path [${req.method} ${req.originalUrl}] does not exist on this server.`,
    errors: null
  });
};