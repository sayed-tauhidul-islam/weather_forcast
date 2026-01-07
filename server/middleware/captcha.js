// Google reCAPTCHA v3 Verification Middleware
import fetch from 'node-fetch';
import { AppError } from './errorHandler.js';

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const MIN_SCORE = parseFloat(process.env.RECAPTCHA_MIN_SCORE) || 0.5;

/**
 * Verify reCAPTCHA token
 * @param {string} token - reCAPTCHA token from frontend
 * @param {string} action - Expected action name
 * @returns {Promise<boolean>} - True if verification passes
 */
export const verifyCaptcha = async (token, action) => {
  // Skip in development if secret not configured
  if (process.env.NODE_ENV !== 'production' && !RECAPTCHA_SECRET) {
    console.log('⚠️ reCAPTCHA: Skipping verification (development mode)');
    return true;
  }

  if (!RECAPTCHA_SECRET) {
    throw new AppError('reCAPTCHA not configured on server', 500);
  }

  if (!token) {
    throw new AppError('reCAPTCHA token is required', 400);
  }

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET}&response=${token}`
    });

    const data = await response.json();

    if (!data.success) {
      console.warn('❌ reCAPTCHA verification failed:', data['error-codes']);
      return false;
    }

    // Check score and action
    if (data.score < MIN_SCORE) {
      console.warn(`⚠️ reCAPTCHA score too low: ${data.score}`);
      return false;
    }

    if (action && data.action !== action) {
      console.warn(`⚠️ reCAPTCHA action mismatch: expected ${action}, got ${data.action}`);
      return false;
    }

    console.log(`✅ reCAPTCHA verified: score ${data.score}, action ${data.action}`);
    return true;

  } catch (error) {
    console.error('❌ reCAPTCHA verification error:', error);
    throw new AppError('Failed to verify reCAPTCHA', 500);
  }
};

/**
 * Express middleware for reCAPTCHA verification
 * @param {string} action - Expected action name
 */
export const captchaMiddleware = (action) => {
  return async (req, res, next) => {
    try {
      const token = req.body.recaptchaToken || req.headers['x-recaptcha-token'];

      const isValid = await verifyCaptcha(token, action);

      if (!isValid) {
        throw new AppError('reCAPTCHA verification failed. Please try again.', 400);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Optional captcha middleware - doesn't block if verification fails
 * Just logs the result
 */
export const optionalCaptcha = (action) => {
  return async (req, res, next) => {
    try {
      const token = req.body.recaptchaToken || req.headers['x-recaptcha-token'];
      
      if (token) {
        const isValid = await verifyCaptcha(token, action);
        req.captchaVerified = isValid;
        req.captchaScore = isValid ? 'passed' : 'failed';
      } else {
        req.captchaVerified = false;
      }
    } catch (error) {
      console.error('Optional captcha error:', error);
      req.captchaVerified = false;
    }
    
    next();
  };
};
