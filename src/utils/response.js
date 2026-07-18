// src/utils/response.js

/**
 * Sends a standardized JSON success response
 */
export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Sends a standardized JSON error response
 */
export const sendError = (res, message, errors = null, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};