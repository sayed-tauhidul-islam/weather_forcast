# 🌤️ SkyCast - Secure Weather Forecast Application

A modern, secure weather forecast application built with React, featuring enterprise-grade security implementations including authentication, API proxying, data encryption, and XSS prevention.

## 🔒 Security Features

### ✅ Implemented Security Measures:

1. **Backend API Proxy**

   - Express.js server acting as secure proxy
   - Prevents API key exposure in frontend
   - Server-side validation and sanitization

2. **User Authentication System**

   - JWT-based authentication
   - Bcrypt password hashing (10 rounds)
   - Token-based session management
   - Protected routes and API endpoints

3. **Input Sanitization (XSS Prevention)**

   - DOMPurify library integration
   - All user inputs sanitized before rendering
   - Special character filtering
   - City name validation (100 char limit)

4. **Data Encryption**

   - AES-256 encryption for localStorage
   - CryptoJS implementation
   - Encrypted favorites and user preferences
   - Secure data at rest

5. **Rate Limiting**

   - Global: 100 requests per 15 minutes
   - Weather API: 10 requests per minute
   - IP-based throttling
   - Prevents DoS attacks

6. **Security Headers**

   - Helmet.js middleware
   - Content Security Policy (CSP)
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Referrer Policy configured

7. **Request Validation**

   - Express-validator middleware
   - Coordinate validation (-90 to 90, -180 to 180)
   - Email format validation
   - Password strength requirements

8. **Error Handling**

   - Generic error messages in production
   - Detailed logs in development only
   - No sensitive data leakage
   - Custom error classes

9. **CORS Configuration**

   - Restricted origin access
   - Credentials support
   - Pre-flight request handling

10. **Password Security**
    - Minimum 8 characters
    - Requires: uppercase, lowercase, number
    - Real-time strength indicator
    - Secure password hashing

---

## 📁 Project Structure

```
Weather forcast/
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx          # Login/Register UI
│   │   ├── WeatherCharts.jsx      # Weather visualizations
│   │   ├── Navbar.jsx             # Navigation component
│   │   └── [40+ other components]
│   ├── utils/
│   │   ├── api.js                 # Secure API client
│   │   ├── sanitizer.js           # Input validation & XSS prevention
│   │   └── encryption.js          # AES encryption utilities
│   ├── App.jsx                    # Main application
│   └── main.jsx                   # Entry point
├── server/
│   ├── routes/
│   │   ├── weather.js             # Weather API proxy routes
│   │   └── auth.js                # Authentication routes
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   ├── validator.js           # Input validation
│   │   └── errorHandler.js        # Error handling
│   ├── server.js                  # Express server
│   ├── package.json
│   └── .env                       # Server config
├── index.html
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd "Weather forcast"
```

2. **Install Frontend Dependencies**

```bash
npm install
```

3. **Install Backend Dependencies**

```bash
cd server
npm install
cd ..
```

4. **Configure Environment Variables**

**Frontend (.env):**

```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (server/.env):**

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRE=7d
```

**⚠️ IMPORTANT:** Change `JWT_SECRET` to a strong random string in production!

---

## 🎯 Running the Application

### Option 1: Run Both (Recommended)

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

### Option 2: Production Build

```bash
# Build frontend
npm run build

# Serve production build
npm run preview

# Run backend in production mode
cd server
NODE_ENV=production npm start
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

## 🔐 API Endpoints

### Public Routes

#### Weather

- `GET /api/weather/forecast?lat={lat}&lon={lon}`
- `GET /api/weather/geocoding?city={cityName}`
- `GET /api/weather/prayer-times?lat={lat}&lon={lon}`
- `GET /api/weather/reverse-geocoding?lat={lat}&lon={lon}`

#### Authentication

- `POST /api/auth/register` - Register new user

  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }
  ```

- `POST /api/auth/login` - User login
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123"
  }
  ```

### Protected Routes (Requires JWT Token)

- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/preferences` - Update preferences

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

---

## 🧪 Testing Security

### 1. Test XSS Prevention

```javascript
// Try entering this in city search:
<script>alert('XSS')</script>
// Result: Sanitized, no script execution
```

### 2. Test Rate Limiting

```bash
# Send 11 requests in 1 minute
for i in {1..11}; do curl http://localhost:5000/api/weather/forecast?lat=22&lon=89; done
# Result: 11th request should be rate limited
```

### 3. Test Authentication

```bash
# Try accessing protected route without token
curl http://localhost:5000/api/auth/profile
# Result: 401 Unauthorized

# With valid token
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/auth/profile
# Result: User profile data
```

### 4. Test Input Validation

```bash
# Invalid coordinates
curl "http://localhost:5000/api/weather/forecast?lat=999&lon=999"
# Result: 400 Bad Request
```

### 5. Test Data Encryption

```javascript
// Check localStorage in browser DevTools
localStorage.getItem("weatherFavorites");
// Result: Encrypted string (not plain JSON)
```

---

## 📊 Security Checklist

- [x] XSS Prevention (DOMPurify)
- [x] SQL Injection Prevention (Not applicable - no SQL)
- [x] CSRF Protection (Token-based auth)
- [x] Rate Limiting (Express-rate-limit)
- [x] Data Encryption (AES-256)
- [x] Password Hashing (Bcrypt)
- [x] JWT Authentication
- [x] Input Validation (Express-validator)
- [x] Security Headers (Helmet)
- [x] CORS Configuration
- [x] Error Handling (No data leakage)
- [x] HTTPS Ready (Configure in production)
- [ ] Database Integration (Future: MongoDB/PostgreSQL)
- [ ] Two-Factor Authentication (Future enhancement)
- [ ] Audit Logging (Future enhancement)

---

## 🌟 Features

### Core Features

- ☀️ Real-time weather data
- 🌍 Global city search
- 📅 7-day forecast
- 📈 24-hour charts
- 🌙 Prayer times
- 🌡️ Temperature units (C/F/K)
- 🎨 Dynamic themes
- 🔔 Weather alerts
- ⭐ Favorite locations
- 🔐 User authentication

### Advanced Features (40+ Components)

- Air quality index
- Moon phase
- Weather radar
- Clothing recommendations
- Activity suggestions
- Weather comparison
- Social sharing
- Achievements & streaks
- Pollen count
- Wind compass
- Golden hour times
- Route weather
- Weekend planner
- And many more!

---

## 🛡️ Security Best Practices

### For Developers:

1. **Never commit `.env` files**

   - Already added to `.gitignore`
   - Store secrets in environment variables

2. **Update dependencies regularly**

   ```bash
   npm audit
   npm audit fix
   ```

3. **Use strong JWT secrets**

   - Minimum 32 characters
   - Random, unique per environment

4. **Enable HTTPS in production**

   ```javascript
   // Add to server.js for production
   app.use((req, res, next) => {
     if (req.header("x-forwarded-proto") !== "https") {
       res.redirect(`https://${req.header("host")}${req.url}`);
     } else {
       next();
     }
   });
   ```

5. **Implement database in production**
   - Current: In-memory storage (users array)
   - Recommended: MongoDB, PostgreSQL, or Supabase

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Solution:** Ensure backend `CLIENT_URL` matches frontend URL in `.env`

### Issue: Rate Limit Exceeded

**Solution:** Wait 1 minute or adjust rate limits in `server.js`

### Issue: JWT Token Invalid

**Solution:** Login again to get fresh token

### Issue: Cannot fetch weather

**Solution:** Check if backend server is running on port 5000

---

## 📦 Dependencies

### Frontend

- react ^18.3.1
- dompurify (XSS prevention)
- crypto-js (Encryption)
- lucide-react (Icons)
- tailwindcss (Styling)

### Backend

- express ^4.18.2
- helmet ^7.1.0 (Security headers)
- cors ^2.8.5
- express-rate-limit ^7.1.5
- bcryptjs ^2.4.3 (Password hashing)
- jsonwebtoken ^9.0.2 (JWT)
- express-validator ^7.0.1
- dotenv ^16.3.1

---

## 📝 License

This project is for educational and demonstration purposes.

---

## 👨‍💻 Author

Built with security in mind 🔒

---

## 🔮 Future Enhancements

- [ ] MongoDB/PostgreSQL integration
- [ ] Two-Factor Authentication (2FA)
- [ ] OAuth2 (Google, Facebook login)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Session management dashboard
- [ ] API usage analytics
- [ ] Geo-blocking features
- [ ] Advanced threat detection
- [ ] Audit logging system
- [ ] Real-time security monitoring

---

## 🆘 Support

For security vulnerabilities, please report privately to: [Your Contact]

For general issues: [Create an issue on GitHub]

---

**⚠️ Security Notice:** This application implements industry-standard security practices but should be further hardened before production deployment. Always conduct security audits and penetration testing before going live.
