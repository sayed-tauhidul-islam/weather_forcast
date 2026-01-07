import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import session from 'express-session';
import connectDB from './config/database.js';
import weatherRoutes from './routes/weather.js';
import authRoutes from './routes/authNew.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import passport from './config/passport.js';
import { enforceHTTPS, hstsMiddleware } from './middleware/httpsEnforcement.js';
import { initSentry, sentryRequestHandler, sentryTracingHandler, sentryErrorHandler } from './config/sentry.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Health Check (MUST BE FIRST - before any middleware)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// HTTPS Enforcement (Production only)
app.use(enforceHTTPS);
app.use(hstsMiddleware);

// Initialize Sentry Error Monitoring
if (process.env.SENTRY_DSN) {
  initSentry(app);
  app.use(sentryRequestHandler());
  app.use(sentryTracingHandler());
}

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google.com/recaptcha/", "https://www.gstatic.com/recaptcha/"],
      frameSrc: ["https://www.google.com/recaptcha/"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:5000", "http://localhost:5174"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration (required for OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'weather-app-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

app.use('/api/weather', weatherRoutes);
app.use('/api/auth', authRoutes);

// Sentry Error Handler (before other error handlers)
if (process.env.SENTRY_DSN) {
  app.use(sentryErrorHandler());
}

// Error Handler (Must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  logger.info(`🚀 Secure Weather Server running on port ${PORT}`);
  logger.info(`🔒 Security features enabled: Helmet, CORS, Rate Limiting, MongoDB`);
  logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📧 Email service configured`);
  logger.info(`🔐 2FA & OAuth ready`);
});
