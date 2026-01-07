import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { registerValidation, loginValidation } from '../middleware/validator.js';
import { protect } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import User from '../models/User.js';
import { sendEmail, emailTemplates } from '../utils/email.js';
import { auditLogger } from '../utils/logger.js';
import passport from '../config/passport.js';
import { captchaMiddleware } from '../middleware/captcha.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register User
router.post('/register', captchaMiddleware('register'), registerValidation, async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    // Create user
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      preferences: {
        favorites: [],
        settings: {}
      }
    });
    
    // Send verification email
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    try {
      await sendEmail(
        email,
        emailTemplates.verification(name, verificationToken, baseUrl)
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }
    
    // Generate token
    const token = generateToken(newUser._id);
    
    // Audit log
    await auditLogger(req, newUser._id, 'REGISTER', { email }, 'LOW');
    
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        isVerified: newUser.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
});

// Verify Email
router.get('/verify-email/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    
    // Audit log
    await auditLogger(req, user._id, 'EMAIL_VERIFICATION', { email: user.email }, 'LOW');
    
    res.json({
      success: true,
      message: 'Email verified successfully!'
    });
  } catch (error) {
    next(error);
  }
});

// Resend Verification Email
router.post('/resend-verification', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    if (user.isVerified) {
      throw new AppError('Email already verified', 400);
    }
    
    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    
    // Send email
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    await sendEmail(
      user.email,
      emailTemplates.verification(user.name, verificationToken, baseUrl)
    );
    
    res.json({
      success: true,
      message: 'Verification email sent!'
    });
  } catch (error) {
    next(error);
  }
});

// Login User
router.post('/login', captchaMiddleware('login'), loginValidation, async (req, res, next) => {
  try {
    const { email, password, twoFactorCode } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      await auditLogger(req, null, 'LOGIN_FAILED', { email, reason: 'user_not_found' }, 'MEDIUM');
      throw new AppError('Invalid credentials', 401);
    }
    
    // Check if account is locked
    if (user.isLocked()) {
      await auditLogger(req, user._id, 'LOGIN_FAILED', { email, reason: 'account_locked' }, 'HIGH');
      throw new AppError('Account is temporarily locked. Please try again later.', 423);
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await user.incLoginAttempts();
      await auditLogger(req, user._id, 'LOGIN_FAILED', { email, reason: 'invalid_password' }, 'MEDIUM');
      throw new AppError('Invalid credentials', 401);
    }
    
    // Check 2FA if enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(200).json({
          success: true,
          requires2FA: true,
          message: 'Please provide 2FA code'
        });
      }
      
      // Verify 2FA code
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 2 // Allow 2 time steps before/after
      });
      
      if (!verified) {
        await auditLogger(req, user._id, 'LOGIN_FAILED', { email, reason: '2fa_failed' }, 'HIGH');
        throw new AppError('Invalid 2FA code', 401);
      }
      
      await auditLogger(req, user._id, '2FA_VERIFIED', { email }, 'LOW');
    }
    
    // Reset login attempts
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }
    
    // Update last login
    user.lastLogin = Date.now();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    // Audit log
    await auditLogger(req, user._id, 'LOGIN_SUCCESS', { email }, 'LOW');
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    next(error);
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    // Always return success to prevent user enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent.'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();
    
    // Send email
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    await sendEmail(
      user.email,
      emailTemplates.passwordReset(user.name, resetToken, baseUrl)
    );
    
    // Audit log
    await auditLogger(req, user._id, 'PASSWORD_RESET_REQUEST', { email }, 'MEDIUM');
    
    res.json({
      success: true,
      message: 'If that email exists, a reset link has been sent.'
    });
  } catch (error) {
    next(error);
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password || password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }
    
    // Hash the token to compare
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    
    // Audit log
    await auditLogger(req, user._id, 'PASSWORD_RESET_SUCCESS', { email: user.email }, 'HIGH');
    
    res.json({
      success: true,
      message: 'Password reset successful! You can now login.'
    });
  } catch (error) {
    next(error);
  }
});

// Enable 2FA
router.post('/2fa/enable', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    if (user.twoFactorEnabled) {
      throw new AppError('2FA is already enabled', 400);
    }
    
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Weather Forecast (${user.email})`
    });
    
    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );
    
    // Save secret temporarily (will be confirmed after verification)
    user.twoFactorSecret = secret.base32;
    user.backupCodes = backupCodes.map(code => 
      crypto.createHash('sha256').update(code).digest('hex')
    );
    await user.save();
    
    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    
    res.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl,
      backupCodes, // Show plain codes only once
      message: 'Scan QR code with Google Authenticator and verify'
    });
  } catch (error) {
    next(error);
  }
});

// Verify and Complete 2FA Setup
router.post('/2fa/verify', protect, async (req, res, next) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user || !user.twoFactorSecret) {
      throw new AppError('2FA setup not initiated', 400);
    }
    
    // Verify code
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2
    });
    
    if (!verified) {
      throw new AppError('Invalid verification code', 400);
    }
    
    // Enable 2FA
    user.twoFactorEnabled = true;
    await user.save();
    
    // Send confirmation email
    await sendEmail(
      user.email,
      emailTemplates.twoFactorEnabled(user.name)
    );
    
    // Audit log
    await auditLogger(req, user._id, '2FA_ENABLED', { email: user.email }, 'HIGH');
    
    res.json({
      success: true,
      message: '2FA enabled successfully!'
    });
  } catch (error) {
    next(error);
  }
});

// Disable 2FA
router.post('/2fa/disable', protect, async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid password', 401);
    }
    
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.backupCodes = [];
    await user.save();
    
    // Audit log
    await auditLogger(req, user._id, '2FA_DISABLED', { email: user.email }, 'HIGH');
    
    res.json({
      success: true,
      message: '2FA disabled successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get User Profile
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -twoFactorSecret -backupCodes');
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        preferences: user.preferences,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update User Preferences
router.put('/preferences', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    user.preferences = {
      ...user.preferences,
      ...req.body
    };
    await user.save();
    
    // Audit log
    await auditLogger(req, user._id, 'PREFERENCES_UPDATED', { changes: req.body }, 'LOW');
    
    res.json({
      success: true,
      preferences: user.preferences
    });
  } catch (error) {
    next(error);
  }
});

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    const token = generateToken(req.user._id);
    await auditLogger(req, req.user._id, 'LOGIN_SUCCESS', { email: req.user.email, method: 'google' }, 'LOW');
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

export default router;
