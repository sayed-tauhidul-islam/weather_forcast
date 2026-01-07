// IP Whitelisting Middleware
// Restricts access to admin routes based on IP addresses

import { AppError } from './errorHandler.js';

// Parse whitelist from environment variable
const parseWhitelist = () => {
  const whitelist = process.env.IP_WHITELIST || '';
  if (!whitelist) return [];
  
  return whitelist.split(',').map(ip => ip.trim()).filter(ip => ip);
};

// Get client IP address
const getClientIP = (req) => {
  // Check various headers for proxied requests
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket?.remoteAddress ||
    'unknown'
  );
};

// IP Whitelist middleware
export const ipWhitelist = (req, res, next) => {
  // Only enforce in production
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  const whitelist = parseWhitelist();
  
  // If no whitelist configured, allow all (but log warning)
  if (whitelist.length === 0) {
    console.warn('⚠️ IP Whitelist: No IPs configured for admin routes!');
    return next();
  }

  const clientIP = getClientIP(req);
  
  // Check if IP is in whitelist
  if (whitelist.includes(clientIP) || whitelist.includes('*')) {
    return next();
  }

  // Log unauthorized access attempt
  console.warn(`🚫 Unauthorized IP access attempt from: ${clientIP}`);
  
  throw new AppError('Access denied: Your IP is not authorized', 403);
};

// Create middleware for specific routes
export const createIPWhitelist = (customWhitelist = []) => {
  return (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }

    const whitelist = customWhitelist.length > 0 
      ? customWhitelist 
      : parseWhitelist();

    if (whitelist.length === 0) {
      return next();
    }

    const clientIP = getClientIP(req);

    if (whitelist.includes(clientIP) || whitelist.includes('*')) {
      return next();
    }

    console.warn(`🚫 IP ${clientIP} blocked from ${req.path}`);
    throw new AppError('Access denied', 403);
  };
};
