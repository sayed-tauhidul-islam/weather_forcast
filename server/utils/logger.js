import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import AuditLog from '../models/AuditLog.js';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Daily rotate file transport for combined logs
const dailyRotateFileTransport = new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // Keep logs for 14 days
  format: logFormat
});

// Daily rotate file transport for error logs
const errorRotateFileTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d', // Keep error logs for 30 days
  level: 'error',
  format: logFormat
});

// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'weather-forecast-api' },
  transports: [
    dailyRotateFileTransport,
    errorRotateFileTransport
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: 'logs/rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
});

// Add console transport for non-production
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: consoleFormat }));
}

// Log rotation events
dailyRotateFileTransport.on('rotate', (oldFilename, newFilename) => {
  logger.info(`Log rotated: ${oldFilename} -> ${newFilename}`);
});

// Audit logging middleware
export const auditLogger = async (req, userId, action, metadata = {}, severity = 'LOW') => {
  try {
    const auditEntry = {
      userId,
      email: req.user?.email || metadata.email,
      action,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      metadata,
      severity,
      timestamp: new Date()
    };
    
    // Save to database
    await AuditLog.create(auditEntry);
    
    // Also log to Winston
    logger.info('Audit Log', auditEntry);
    
  } catch (error) {
    logger.error('Failed to create audit log:', error);
  }
};

// Security event logger
export const logSecurityEvent = async (req, action, metadata, severity = 'MEDIUM') => {
  const event = {
    action,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    metadata,
    severity,
    timestamp: new Date()
  };
  
  await AuditLog.create(event);
  logger.warn('Security Event', event);
};

export default logger;
