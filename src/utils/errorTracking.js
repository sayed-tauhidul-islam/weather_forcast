// Frontend Error Tracking with Sentry
import * as Sentry from '@sentry/react';

// Initialize Sentry for React
export const initSentry = () => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.log('⚠️ Sentry DSN not configured');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
    
    // Performance Monitoring
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Filter sensitive data
    beforeSend(event, hint) {
      // Remove passwords and tokens
      if (event.request) {
        delete event.request.cookies;
        
        if (event.request.data) {
          const data = typeof event.request.data === 'string' 
            ? JSON.parse(event.request.data) 
            : event.request.data;
          
          if (data.password) data.password = '[REDACTED]';
          if (data.token) data.token = '[REDACTED]';
          
          event.request.data = JSON.stringify(data);
        }
      }

      return event;
    },

    // Ignore specific errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Network request failed',
    ],
  });

  console.log('✅ Sentry initialized');
};

// Error Boundary Component
export const ErrorBoundary = Sentry.ErrorBoundary;

// Manual error capture
export const captureException = (error, context = {}) => {
  Sentry.captureException(error, { extra: context });
};

// Set user context
export const setUser = (user) => {
  Sentry.setUser(user ? {
    id: user.id,
    email: user.email,
    username: user.name,
  } : null);
};

// Add breadcrumb
export const addBreadcrumb = (message, category = 'custom', level = 'info') => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now(),
  });
};

export default Sentry;
