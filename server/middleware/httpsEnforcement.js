// HTTPS Enforcement Middleware
// Redirects HTTP requests to HTTPS in production

export const enforceHTTPS = (req, res, next) => {
  // Only enforce HTTPS in production
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // Check if request is already secure
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }

  // Redirect to HTTPS
  const httpsUrl = `https://${req.headers.host}${req.url}`;
  res.redirect(301, httpsUrl);
};

// Strict Transport Security (HSTS) middleware
export const hstsMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // Tell browsers to always use HTTPS for 1 year
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
};
