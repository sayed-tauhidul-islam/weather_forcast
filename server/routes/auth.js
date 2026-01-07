import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerValidation, loginValidation } from '../middleware/validator.js';
import { protect } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// In-memory user storage (Replace with database in production)
const users = [];

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register User
router.post('/register', registerValidation, async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      preferences: {
        favorites: [],
        settings: {}
      }
    };
    
    users.push(newUser);
    
    // Generate token
    const token = generateToken(newUser.id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login User
router.post('/login', loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get User Profile (Protected Route)
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update User Preferences (Protected Route)
router.put('/preferences', protect, async (req, res, next) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    user.preferences = {
      ...user.preferences,
      ...req.body
    };
    
    res.json({
      success: true,
      preferences: user.preferences
    });
  } catch (error) {
    next(error);
  }
});

export default router;
