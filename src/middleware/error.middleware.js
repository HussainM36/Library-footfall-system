// src/middleware/error.middleware.js
import { HTTP_STATUS } from '../constants/index.js';
import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`[Error Log]: ${err.stack || err.message}`);

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'An unexpected server error occurred.';
  const errors = err.errors || null;

  return sendError(res, message, errors, statusCode);
};