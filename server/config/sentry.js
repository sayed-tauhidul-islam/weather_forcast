// Sentry Error Monitoring Configuration
import * as Sentry from '@sentry/node';

export const initSentry = (app) => {
  // Only initialize Sentry if DSN is configured
  if (!process.env.SENTRY_DSN) {
    console.log('⚠️ Sentry DSN not configured, error monitoring disabled');
    return;
  }

  console.log('🔍 Initializing Sentry error monitoring...');

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    
    // Performance Monitoring
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.1,
    
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
    ],

    // Filter sensitive data
    beforeSend(event, hint) {
      // Remove sensitive data from error reports
      if (event.request) {
        delete event.request.cookies;
        
        // Remove authorization headers
        if (event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers['x-auth-token'];
        }
      }

      // Remove password fields from extra data
      if (event.extra) {
        removePasswords(event.extra);
      }

      return event;
    },

    // Ignore specific errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Network request failed',
      'Failed to fetch',
    ],
  });

  console.log('✅ Sentry initialized');
};

// Helper function to remove passwords from objects
const removePasswords = (obj) => {
  if (typeof obj !== 'object' || obj === null) return;
  
  Object.keys(obj).forEach(key => {
    if (key.toLowerCase().includes('password') || key.toLowerCase().includes('secret')) {
      obj[key] = '[REDACTED]';
    } else if (typeof obj[key] === 'object') {
      removePasswords(obj[key]);
    }
  });
};

// Request handler (must be first middleware)
export const sentryRequestHandler = () => Sentry.Handlers.requestHandler();

// Tracing handler
export const sentryTracingHandler = () => Sentry.Handlers.tracingHandler();

// Error handler (must be before other error handlers)
export const sentryErrorHandler = () => Sentry.Handlers.errorHandler({
  shouldHandleError(error) {
    // Capture all errors with status >= 500
    if (error.status >= 500) {
      return true;
    }
    return false;
  },
});

// Manual error capture
export const captureException = (error, context = {}) => {
  Sentry.captureException(error, { extra: context });
};

// Manual message capture
export const captureMessage = (message, level = 'info') => {
  Sentry.captureMessage(message, level);
};

export default Sentry;
