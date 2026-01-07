import DOMPurify from 'dompurify';

// Sanitize user input to prevent XSS attacks
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove any HTML tags and dangerous characters
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true
  });
  
  return sanitized.trim();
};

// Sanitize city name specifically
export const sanitizeCityName = (cityName) => {
  if (!cityName) return '';
  
  const sanitized = sanitizeInput(cityName);
  
  // Only allow letters, numbers, spaces, commas, dots, and hyphens
  const cleaned = sanitized.replace(/[^a-zA-Z0-9\s,.-]/g, '');
  
  // Limit length
  return cleaned.substring(0, 100);
};

// Validate coordinates
export const validateCoordinates = (lat, lon) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return false;
  }
  
  if (latitude < -90 || latitude > 90) {
    return false;
  }
  
  if (longitude < -180 || longitude > 180) {
    return false;
  }
  
  return true;
};

// Sanitize object (recursively sanitize all string values)
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  const sanitized = {};
  
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeInput(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  
  return sanitized;
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return {
    valid: minLength && hasUppercase && hasLowercase && hasNumber,
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber
  };
};
