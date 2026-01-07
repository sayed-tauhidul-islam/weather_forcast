# 📝 Environment Variables Reference

Complete reference for all environment variables used in Weather Forecast App.

---

## 🔴 Required Variables (Must be set)

### Application

| Variable   | Type   | Description      | Example                     |
| ---------- | ------ | ---------------- | --------------------------- |
| `NODE_ENV` | String | Environment mode | `production`, `development` |
| `PORT`     | Number | Server port      | `5000`                      |

### Security

| Variable         | Type   | Description                              | Example                             |
| ---------------- | ------ | ---------------------------------------- | ----------------------------------- |
| `JWT_SECRET`     | String | JWT signing secret (min 32 chars)        | Generated via `generate-secrets.js` |
| `SESSION_SECRET` | String | Session encryption secret (min 32 chars) | Generated via `generate-secrets.js` |

### Database

| Variable      | Type   | Description               | Example                                           |
| ------------- | ------ | ------------------------- | ------------------------------------------------- |
| `MONGODB_URI` | String | MongoDB connection string | `mongodb://user:pass@localhost:27017/weather-app` |

### Email

| Variable         | Type   | Description                         | Example                |
| ---------------- | ------ | ----------------------------------- | ---------------------- |
| `EMAIL_SERVICE`  | String | Email service provider              | `gmail`                |
| `EMAIL_USER`     | String | Email account username              | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | String | Email account password/app-password | `abcd efgh ijkl mnop`  |

---

## 🟡 Optional but Recommended

### OAuth (Google)

| Variable               | Type   | Description                | Example                                       |
| ---------------------- | ------ | -------------------------- | --------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | String | Google OAuth Client ID     | `123456.apps.googleusercontent.com`           |
| `GOOGLE_CLIENT_SECRET` | String | Google OAuth Client Secret | `GOCSPX-abc123...`                            |
| `GOOGLE_CALLBACK_URL`  | String | OAuth redirect URL         | `https://domain.com/api/auth/google/callback` |

### External APIs

| Variable              | Type   | Description            | Default                      |
| --------------------- | ------ | ---------------------- | ---------------------------- |
| `OPENWEATHER_API_KEY` | String | OpenWeatherMap API key | -                            |
| `ALADHAN_API_URL`     | String | Prayer times API URL   | `https://api.aladhan.com/v1` |

### reCAPTCHA

| Variable               | Type   | Description                    | Example  |
| ---------------------- | ------ | ------------------------------ | -------- |
| `RECAPTCHA_SECRET_KEY` | String | reCAPTCHA server-side secret   | `6Lc...` |
| `RECAPTCHA_MIN_SCORE`  | Float  | Minimum acceptable score (0-1) | `0.5`    |

### Error Monitoring (Sentry)

| Variable                    | Type   | Description                 | Example                     |
| --------------------------- | ------ | --------------------------- | --------------------------- |
| `SENTRY_DSN`                | String | Sentry project DSN          | `https://...@sentry.io/...` |
| `SENTRY_ENVIRONMENT`        | String | Environment name for Sentry | `production`                |
| `SENTRY_TRACES_SAMPLE_RATE` | Float  | Traces sampling (0-1)       | `0.1`                       |

### Security Features

| Variable       | Type   | Description                 | Example                   |
| -------------- | ------ | --------------------------- | ------------------------- |
| `IP_WHITELIST` | String | Comma-separated allowed IPs | `203.0.113.1,203.0.113.2` |
| `CORS_ORIGIN`  | String | Allowed CORS origins        | `https://domain.com`      |

---

## 🟢 Optional Configuration

### JWT Configuration

| Variable     | Type   | Description          | Default |
| ------------ | ------ | -------------------- | ------- |
| `JWT_EXPIRE` | String | JWT token expiration | `7d`    |

### Email Configuration

| Variable     | Type   | Description                   | Default                            |
| ------------ | ------ | ----------------------------- | ---------------------------------- |
| `EMAIL_FROM` | String | Email "From" name and address | `Weather App <noreply@domain.com>` |

### Rate Limiting

| Variable                  | Type   | Description                      | Default           |
| ------------------------- | ------ | -------------------------------- | ----------------- |
| `RATE_LIMIT_WINDOW_MS`    | Number | Rate limit window (milliseconds) | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Number | Max requests per window          | `100`             |

### Logging

| Variable    | Type   | Description                               | Default |
| ----------- | ------ | ----------------------------------------- | ------- |
| `LOG_LEVEL` | String | Winston log level                         | `info`  |
|             |        | Options: `error`, `warn`, `info`, `debug` |         |

### Session Configuration

| Variable                  | Type    | Description           | Default              |
| ------------------------- | ------- | --------------------- | -------------------- |
| `SESSION_COOKIE_SECURE`   | Boolean | HTTPS-only cookies    | `true` in production |
| `SESSION_COOKIE_HTTPONLY` | Boolean | Prevent JS access     | `true`               |
| `SESSION_COOKIE_SAMESITE` | String  | SameSite policy       | `strict`             |
| `SESSION_MAX_AGE`         | Number  | Session duration (ms) | `86400000` (24h)     |

### Frontend

| Variable       | Type   | Description                  | Default                 |
| -------------- | ------ | ---------------------------- | ----------------------- |
| `FRONTEND_URL` | String | Frontend URL for email links | `http://localhost:5173` |

---

## 📋 Frontend Environment Variables (Vite)

Create `.env` in root directory:

```env
# API Backend
VITE_API_URL=https://yourdomain.com/api

# reCAPTCHA (Public Site Key)
VITE_RECAPTCHA_SITE_KEY=6Lc...

# Sentry (Frontend)
VITE_SENTRY_DSN=https://...@sentry.io/...
VITE_SENTRY_ENVIRONMENT=production
```

---

## 🔧 Environment-Specific Examples

### Development (.env)

```env
NODE_ENV=development
PORT=5000
LOG_LEVEL=debug

JWT_SECRET=dev-secret-key-not-for-production
SESSION_SECRET=dev-session-secret

MONGODB_URI=mongodb://localhost:27017/weather-app

EMAIL_SERVICE=gmail
EMAIL_USER=test@gmail.com
EMAIL_PASSWORD=test-password

OPENWEATHER_API_KEY=your-key-here

# Skip reCAPTCHA in development
# RECAPTCHA_SECRET_KEY=

# No Sentry in development
# SENTRY_DSN=
```

### Staging (.env.staging)

```env
NODE_ENV=staging
PORT=5000
LOG_LEVEL=info

JWT_SECRET=staging-jwt-secret-64-chars-minimum-please-generate-properly
SESSION_SECRET=staging-session-secret-64-chars-minimum

MONGODB_URI=mongodb://staging_user:password@staging-db:27017/weather-app?authSource=admin

EMAIL_SERVICE=gmail
EMAIL_USER=staging@yourdomain.com
EMAIL_PASSWORD=staging-app-password

GOOGLE_CLIENT_ID=staging-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=staging-secret
GOOGLE_CALLBACK_URL=https://staging.yourdomain.com/api/auth/google/callback

RECAPTCHA_SECRET_KEY=staging-recaptcha-secret
RECAPTCHA_MIN_SCORE=0.5

SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=staging

CORS_ORIGIN=https://staging.yourdomain.com

FRONTEND_URL=https://staging.yourdomain.com
```

### Production (.env.production)

See [.env.production](.env.production) file for full template.

---

## ⚙️ How to Use

### Setting Environment Variables

**Development (local):**

```bash
# Copy template
cp .env.example .env

# Edit values
nano .env
```

**Production (server):**

```bash
# Option 1: .env file
nano .env

# Option 2: Export in shell
export JWT_SECRET="your-secret"

# Option 3: PM2 ecosystem file
pm2 start ecosystem.config.js
```

**PM2 Ecosystem Example:**

```javascript
module.exports = {
  apps: [
    {
      name: "weather-api",
      script: "./server.js",
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
        JWT_SECRET: process.env.JWT_SECRET,
        // ... other vars
      },
    },
  ],
};
```

### Validating Variables

Check if required variables are set:

```bash
node -e "
const required = ['JWT_SECRET', 'MONGODB_URI', 'EMAIL_USER'];
const missing = required.filter(v => !process.env[v]);
if (missing.length) {
  console.error('Missing required variables:', missing);
  process.exit(1);
}
console.log('✅ All required variables set');
"
```

---

## 🔐 Security Best Practices

1. **Never commit .env files to Git**

   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.production
   .env.staging
   ```

2. **Use strong secrets**

   ```bash
   # Generate with script
   node scripts/generate-secrets.js

   # Or manually
   openssl rand -base64 32
   ```

3. **Rotate secrets regularly**

   - JWT_SECRET: Every 90 days
   - SESSION_SECRET: Every 90 days
   - API keys: When compromised

4. **Different secrets per environment**

   - Never use dev secrets in production
   - Use unique secrets for staging/production

5. **Use secret management tools**
   - AWS Secrets Manager
   - HashiCorp Vault
   - Azure Key Vault
   - Google Cloud Secret Manager

---

## 📚 References

- [dotenv Documentation](https://github.com/motdotla/dotenv)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## ✅ Quick Validation Checklist

Before deployment, verify:

- [ ] All required variables are set
- [ ] Secrets are at least 32 characters
- [ ] MongoDB URI includes authentication
- [ ] Email credentials are app-specific passwords
- [ ] OAuth callback URLs match domain
- [ ] CORS_ORIGIN matches frontend domain
- [ ] FRONTEND_URL matches actual URL
- [ ] No placeholder values remain
- [ ] .env files not in Git
- [ ] Variables validated in staging first

---

**Need help? Check [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) for full setup guide.**
