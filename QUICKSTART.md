# 🎯 Quick Start Guide

## Running the Secure Weather Forecast App

### Step 1: Start Backend Server

Open Terminal 1:

```bash
cd "f:\My projects\Weather forcast\server"
npm start
```

✅ Server should show: "Secure Weather Server running on port 5000"

### Step 2: Start Frontend

Open Terminal 2:

```bash
cd "f:\My projects\Weather forcast"
npm run dev
```

✅ Frontend should open at: http://localhost:5173

### Step 3: Test the Application

1. **Test Weather Search** (No login required)

   - Search for any city (e.g., "Dhaka", "London")
   - View weather data securely proxied through backend

2. **Test Authentication**

   - Click the 🔐 Login button (top right)
   - Create an account with:
     - Email: test@example.com
     - Password: TestPass123
     - Name: Test User
   - Login with credentials

3. **Test Security Features**

   - Try XSS: Enter `<script>alert('hack')</script>` in city search
   - Result: Sanitized, no alert

   - Check localStorage: `localStorage.getItem('weatherFavorites')`
   - Result: Encrypted data (not readable JSON)

4. **Test Rate Limiting**
   - Rapidly search for cities 10+ times
   - Result: Should get rate limited after 10 requests/minute

### All Features Working! 🎉

#### ✅ Security Implementations:

- [x] Backend API Proxy (Express.js)
- [x] User Authentication (JWT + Bcrypt)
- [x] Input Sanitization (DOMPurify)
- [x] Data Encryption (AES-256)
- [x] Rate Limiting (10 req/min)
- [x] Security Headers (Helmet + CSP)
- [x] Input Validation (Express-validator)
- [x] Error Handling (No info leak)
- [x] CORS Protection
- [x] Password Hashing

### Default Ports:

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### Troubleshooting:

- **Port already in use?** Kill process: `npx kill-port 5000` or `npx kill-port 5173`
- **CORS error?** Check `.env` files match
- **Module not found?** Run `npm install` in both root and server folders

---

## Security Features Explained:

### 1. XSS Prevention

- All user inputs sanitized with DOMPurify
- No HTML/scripts can be injected

### 2. Encrypted Storage

- Favorites and settings encrypted in localStorage
- AES-256 encryption prevents tampering

### 3. API Security

- All API calls proxied through backend
- No exposed endpoints in frontend
- Server-side validation

### 4. Authentication

- JWT tokens for session management
- Bcrypt password hashing (10 rounds)
- Token expires in 7 days

### 5. Rate Limiting

- Global: 100 requests per 15 min
- Weather: 10 requests per min
- Prevents DDoS attacks

---

**Ready to go! 🚀**
