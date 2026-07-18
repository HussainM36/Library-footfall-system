// src/validators/visit.validator.js
import { body, validationResult } from 'express-validator';
import { HTTP_STATUS } from '../constants/index.js';
import { sendError } from '../utils/response.js';

const runValidation = (req, res, next) => {
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
};

export const validateCheckIn = [
  body('membership_no').notEmpty().withMessage('Membership number is required.').trim(),
  body('purpose_id').isInt().withMessage('A valid Purpose ID is required.'),
  body('remarks').optional().trim(),
  runValidation
];

export const validateCheckOut = [
  body('membership_no').notEmpty().withMessage('Membership number is required.').trim(),
  runValidation
];