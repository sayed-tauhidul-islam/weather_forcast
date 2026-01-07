export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log error details in development only
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }
  
  // Send generic error message in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'An error occurred' 
    : err.message;
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
