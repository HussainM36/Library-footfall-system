// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/index.js';
import { sendError } from '../utils/response.js';

export const protect = async (req, res, next) => {
  let token;

  // Check Authorization header for Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Alternatively check incoming cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendError(res, 'Not authorized, token missing.', null, HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user contextual data to request body/object
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };

    next();
  } catch (error) {
    return sendError(res, 'Not authorized, token invalid or expired.', null, HTTP_STATUS.UNAUTHORIZED);
  }
};

/**
 * Restricts route strictly to specified roles (e.g., Admin only)
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Forbidden: You do not have permission.', null, HTTP_STATUS.FORBIDDEN);
    }
    next();
  };
};