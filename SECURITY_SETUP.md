# Weather Forecast App - Security Implementation Guide

## 🔒 Security Features Implemented

### ✅ Completed Features

1. **MongoDB Database Integration**

   - User authentication and profile storage
   - Audit logging for security events
   - Session management

2. **Email Verification System**

   - Verification emails with expiration (24 hours)
   - Resend verification option
   - Email templates with HTML styling

3. **Password Reset Flow**

   - Secure token-based password reset
   - Token expiration (1 hour)
   - Email notifications

4. **Two-Factor Authentication (2FA)**

   - TOTP-based authentication (Google Authenticator, Authy)
   - QR code generation for easy setup
   - Backup codes for account recovery
   - Enable/disable from settings

5. **OAuth Integration**

   - Google login (Facebook ready but commented out)
   - Account linking for existing users
   - Secure callback handling

6. **Audit Logging**

   - All security events logged (login, 2FA, password changes)
   - IP address and user agent tracking
   - Severity levels for events
   - Searchable audit trail

7. **Security Measures**
   - Account lockout after 5 failed login attempts
   - JWT token authentication
   - Password hashing with Bcrypt
   - XSS protection with DOMPurify
   - HTTPS enforcement (production)
   - Rate limiting on all routes
   - CORS configuration
   - CSP headers with Helmet

---

## 📋 Setup Instructions

### 1. Install MongoDB

#### Windows:

```bash
# Download MongoDB Community Server from:
# https://www.mongodb.com/try/download/community

# Or install via Chocolatey:
choco install mongodb

# Start MongoDB service:
net start MongoDB
```

#### Linux (Ubuntu/Debian):

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### macOS:

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### 2. Configure Environment Variables

Edit `server/.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/weather-app

# JWT Secret (Change this to a random string!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Secret (Change this to a random string!)
SESSION_SECRET=your-super-secret-session-key-change-this

# Environment
NODE_ENV=development
LOG_LEVEL=info
```

### 3. Setup Gmail for Email Sending

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Go to **App Passwords**: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)"
5. Name it "Weather App"
6. Copy the 16-character password
7. Use this password in `EMAIL_PASSWORD` in `.env`

### 4. Setup Google OAuth

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen if needed
6. Application type: **Web application**
7. Authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
8. Copy **Client ID** and **Client Secret** to `.env`

### 5. Install Dependencies

```bash
cd server
npm install

cd ..
npm install
```

### 6. Start the Application

**Option 1: Start both servers separately**

Terminal 1 (Backend):

```bash
cd server
node server.js
```

Terminal 2 (Frontend):

```bash
npm run dev
```

**Option 2: Use concurrently (if configured)**

```bash
npm run dev
```

---

## 🎯 Usage Guide

### Email Verification

1. Sign up with email and password
2. Check your email for verification link
3. Click the link to verify your account
4. If not received, click "Resend Email" in settings

### Two-Factor Authentication

1. Log in to your account
2. Go to **Settings** (⚙️ icon)
3. Scroll to **Security** section
4. Click **Enable** under "Two-Factor Authentication"
5. Scan QR code with Google Authenticator or Authy
6. Enter 6-digit code to confirm
7. Save backup codes in a secure place
8. Next login will require 2FA code

### Password Reset

1. Click "Forgot Password?" on login modal
2. Enter your email address
3. Check email for reset link
4. Click link and enter new password
5. Password reset successful

### OAuth Login

1. Click "Login" button
2. Go to **Settings** → **Security** → **Connected Accounts**
3. Click "Connect" next to Google
4. Authorize the app
5. Your Google account will be linked

---

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/preferences` - Update user preferences

### Email Verification

- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email

### Password Reset

- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Two-Factor Authentication

- `POST /api/auth/2fa/enable` - Start 2FA setup (returns QR code)
- `POST /api/auth/2fa/verify` - Verify and enable 2FA
- `POST /api/auth/2fa/disable` - Disable 2FA

### OAuth

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

---

## 🧪 Testing

### Test Email Verification

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'

# Check terminal for email link (development mode shows link in console)
```

### Test 2FA

1. Enable 2FA via UI
2. Use Google Authenticator to scan QR code
3. Logout and login again
4. Enter 6-digit code when prompted

### Test Password Reset

1. Click "Forgot Password"
2. Enter email
3. Check terminal for reset link
4. Click link and set new password

---

## 🛡️ Security Best Practices

### Production Deployment Checklist

- [ ] Change `JWT_SECRET` to a strong random string (use: `openssl rand -base64 32`)
- [ ] Change `SESSION_SECRET` to a strong random string
- [ ] Use real Gmail credentials or SMTP service
- [ ] Enable HTTPS (update `GOOGLE_CALLBACK_URL` to https)
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB with authentication
- [ ] Use environment variables (not .env file in production)
- [ ] Enable MongoDB replica set for production
- [ ] Set up automatic backups for MongoDB
- [ ] Configure rate limiting appropriately
- [ ] Review CORS settings for production domain
- [ ] Enable MongoDB connection pooling
- [ ] Monitor audit logs regularly

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Special characters recommended

### Account Security

- Account locks after 5 failed login attempts (2 hours)
- 2FA codes expire after use
- Email verification tokens expire in 24 hours
- Password reset tokens expire in 1 hour
- All security events are logged

---

## 📊 Database Schema

### User Model

```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  emailVerified: Boolean,
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  twoFactorSecret: String,
  twoFactorEnabled: Boolean,
  backupCodes: [String],
  googleId: String,
  facebookId: String,
  loginAttempts: Number,
  lockUntil: Date,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date,
  preferences: {
    unit: String,
    language: String,
    notifications: Boolean
  }
}
```

### AuditLog Model

```javascript
{
  userId: ObjectId (ref: User),
  action: String (LOGIN_SUCCESS, 2FA_ENABLED, etc.),
  ipAddress: String,
  userAgent: String,
  details: Object,
  severity: String (INFO, WARNING, ERROR),
  timestamp: Date
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Ensure MongoDB is running

```bash
# Windows
net start MongoDB

# Linux/macOS
sudo systemctl start mongod
```

### Email Not Sending

**Solution:**

1. Check Gmail app password is correct
2. Enable "Less secure app access" if using regular password
3. Check logs for detailed error: `server/logs/error.log`

### 2FA QR Code Not Showing

**Solution:**

1. Check browser console for errors
2. Ensure backend is running
3. Check `/api/auth/2fa/enable` endpoint response

### OAuth Callback Error

**Solution:**

1. Verify Google OAuth credentials in `.env`
2. Check callback URL matches Google Console
3. Ensure `express-session` is installed

---

## 📞 Support

For issues or questions:

1. Check logs: `server/logs/combined.log` and `server/logs/error.log`
2. Review audit logs in MongoDB for security events
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

## 🚀 Next Steps (Optional Enhancements)

- [ ] Add Facebook OAuth
- [ ] Implement SMS-based 2FA
- [ ] Add biometric authentication (WebAuthn)
- [ ] Implement session management (view active sessions)
- [ ] Add password change history
- [ ] Implement IP whitelisting
- [ ] Add device fingerprinting
- [ ] Create admin dashboard for user management
- [ ] Add CAPTCHA for login attempts
- [ ] Implement security notifications (email on login from new device)

---

## 📝 License

This security implementation follows industry best practices and OWASP guidelines.
