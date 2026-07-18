// src/validators/auth.validator.js
import { body, validationResult } from 'express-validator';
import { HTTP_STATUS } from '../constants/index.js';
import { sendError } from '../utils/response.js';

export const validateLogin = [
  body('username')
    .notEmpty().withMessage('Username is required.')
    .trim(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(
        res, 
        'Validation failed.', 
        errors.array().map(err => ({ field: err.path, message: err.msg })), 
        HTTP_STATUS.BAD_REQUEST
      );
    }
    next();
  }
];