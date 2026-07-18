// src/controllers/auth.controller.js
import { AuthService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';

export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    const { admin, token } = await AuthService.login(username, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return sendSuccess(res, 'Login successful.', { admin, token }, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};