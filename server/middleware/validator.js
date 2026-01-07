import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map(err => err.msg).join(', ');
    return next(new AppError(message, 400));
  }
  next();
};

// Validation Rules
export const weatherValidation = [
  query('lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('lon')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  query('city')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9\s,.-]+$/)
    .withMessage('City name contains invalid characters'),
  validate
];

export const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and number'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  validate
];

export const loginValidation = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];
