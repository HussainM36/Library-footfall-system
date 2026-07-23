// src/controllers/auth.controller.js
import { AuthService } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';

export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return sendError(res, 'Please provide both username and password.', null, HTTP_STATUS.BAD_REQUEST);
    }

    const cleanUsername = username.trim();

    // -------------------------------------------------------------
    // 1. HARDCODED MASTER ADMIN BYPASS (Default Emergency Login)
    // -------------------------------------------------------------
    if (cleanUsername.toLowerCase() === 'admin' && password === 'admin123') {
      const fallbackToken = 'master_admin_session_token_12345';
      const masterAdminObj = { admin_id: 1, username: 'admin', role: 'Administrator' };

      res.cookie('token', fallbackToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      return sendSuccess(
        res, 
        'Master Administrator Login Successful.', 
        { admin: masterAdminObj, token: fallbackToken }, 
        HTTP_STATUS.OK
      );
    }

    // -------------------------------------------------------------
    // 2. STANDARD DATABASE AUTHENTICATION (Case-insensitive check)
    // -------------------------------------------------------------
    try {
      const { admin, token } = await AuthService.login(cleanUsername.toLowerCase(), password);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
      });

      return sendSuccess(res, 'Login successful.', { admin, token }, HTTP_STATUS.OK);
    } catch (authError) {
      // If DB auth fails, provide clear feedback instead of unhandled error status
      return sendError(
        res, 
        authError.message || 'Invalid admin credentials or password.', 
        null, 
        HTTP_STATUS.UNAUTHORIZED
      );
    }

  } catch (error) {
    next(error);
  }
};