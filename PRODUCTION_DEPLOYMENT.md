# 🚀 Production Deployment Guide

Complete guide for deploying Weather Forecast App to production

---

## 📋 Pre-Deployment Checklist

### 1. Server Requirements

- [ ] Node.js 18+ installed
- [ ] MongoDB 6.0+ installed and running
- [ ] Nginx (for reverse proxy)
- [ ] SSL certificate (Let's Encrypt recommended)
- [ ] Domain name configured
- [ ] Minimum 2GB RAM, 2 CPU cores
- [ ] 20GB storage space

### 2. Security Setup

- [ ] Strong secrets generated (JWT, Session)
- [ ] MongoDB authentication enabled
- [ ] Firewall configured (UFW/firewalld)
- [ ] Fail2ban installed (optional but recommended)
- [ ] Regular backups configured

---

## 🔧 Step-by-Step Deployment

### Step 1: Generate Production Secrets

```bash
cd server
node scripts/generate-secrets.js
```

Save the generated secrets securely!

### Step 2: Setup MongoDB Authentication

```bash
# Run the setup script
node scripts/setup-mongodb-auth.js

# Follow the prompts:
# - Database name: weather-app
# - Username: weatherapp_user
# - Password: (min 16 characters)
```

Enable authentication in MongoDB:

```bash
# Edit MongoDB config
sudo nano /etc/mongod.conf

# Add these lines:
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod
```

### Step 3: Configure Environment Variables

Copy the production template:

```bash
cp .env.production .env
```

Edit `.env` with your values:

```bash
nano .env
```

**Critical values to change:**

1. `JWT_SECRET` - Use generated secret
2. `SESSION_SECRET` - Use generated secret
3. `MONGODB_URI` - Add username/password
4. `EMAIL_USER` & `EMAIL_PASSWORD` - Gmail credentials
5. `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth credentials
6. `CORS_ORIGIN` - Your production domain
7. `FRONTEND_URL` - Your production URL

### Step 4: Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal:
sudo certbot renew --dry-run
```

### Step 5: Configure Nginx Reverse Proxy

Create Nginx config:

```bash
sudo nano /etc/nginx/sites-available/weather-app
```

Add this configuration:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend (React build)
    location / {
        root /var/www/weather-app/dist;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Logs
    access_log /var/log/nginx/weather-app-access.log;
    error_log /var/log/nginx/weather-app-error.log;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/weather-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Setup PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
cd server
pm2 start server.js --name weather-api

# Save PM2 config
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs

# Monitor logs
pm2 logs weather-api
```

### Step 7: Build and Deploy Frontend

```bash
# Build production bundle
npm run build

# Copy to web root
sudo mkdir -p /var/www/weather-app
sudo cp -r dist/* /var/www/weather-app/

# Set permissions
sudo chown -R www-data:www-data /var/www/weather-app
```

### Step 8: Configure Firewall

```bash
# Install UFW
sudo apt install ufw

# Allow essential ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Step 9: Setup MongoDB Backups

Create backup script:

```bash
sudo nano /usr/local/bin/backup-mongodb.sh
```

Add:

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d-%H%M)
BACKUP_DIR="/var/backups/mongodb"
DB_NAME="weather-app"
DB_USER="weatherapp_user"
DB_PASS="your-password"

mkdir -p $BACKUP_DIR

mongodump \
  --uri="mongodb://${DB_USER}:${DB_PASS}@localhost:27017/${DB_NAME}?authSource=admin" \
  --out="${BACKUP_DIR}/backup-${DATE}"

# Delete backups older than 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed: backup-${DATE}"
```

Make executable:

```bash
sudo chmod +x /usr/local/bin/backup-mongodb.sh
```

Add to crontab (daily at 2 AM):

```bash
sudo crontab -e

# Add this line:
0 2 * * * /usr/local/bin/backup-mongodb.sh >> /var/log/mongodb-backup.log 2>&1
```

### Step 10: Setup Log Rotation

PM2 handles log rotation automatically. For MongoDB:

```bash
sudo nano /etc/logrotate.d/mongodb
```

Add:

```
/var/log/mongodb/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0600 mongodb mongodb
    sharedscripts
    postrotate
        /bin/kill -SIGUSR1 $(pgrep -f mongod) > /dev/null 2>&1 || true
    endscript
}
```

---

## 🔍 Verification & Testing

### Test Backend API

```bash
# Health check
curl https://yourdomain.com/api/health

# Test register
curl -X POST https://yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

### Test Frontend

Visit: `https://yourdomain.com`

Check:

- [ ] Homepage loads
- [ ] Login/Register works
- [ ] Weather data displays
- [ ] Settings accessible
- [ ] No console errors

---

## 📊 Monitoring & Maintenance

### PM2 Commands

```bash
# Status
pm2 status

# Logs
pm2 logs weather-api

# Restart
pm2 restart weather-api

# Stop
pm2 stop weather-api

# Memory/CPU usage
pm2 monit
```

### MongoDB Commands

```bash
# Connect to MongoDB
mongosh mongodb://weatherapp_user:password@localhost:27017/weather-app?authSource=admin

# Check database size
db.stats()

# Count users
db.users.count()

# View recent audit logs
db.auditlogs.find().sort({timestamp:-1}).limit(10)
```

### Nginx Commands

```bash
# Test config
sudo nginx -t

# Reload (graceful)
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# Check logs
sudo tail -f /var/log/nginx/weather-app-error.log
```

---

## 🚨 Troubleshooting

### Backend not starting

```bash
# Check PM2 logs
pm2 logs weather-api --lines 100

# Check if port is in use
sudo netstat -tulpn | grep 5000

# Restart manually
cd server
node server.js
```

### MongoDB connection failed

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongosh mongodb://localhost:27017

# Verify authentication
mongosh mongodb://weatherapp_user:password@localhost:27017/weather-app?authSource=admin
```

### SSL certificate issues

```bash
# Renew certificate
sudo certbot renew

# Check certificate expiry
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

### High CPU/Memory usage

```bash
# Check processes
htop

# PM2 memory limit
pm2 restart weather-api --max-memory-restart 500M

# Analyze Node.js memory
node --inspect server.js
```

---

## 🔄 Update & Rollback

### Deploy new version

```bash
# Backend
cd server
git pull
npm install
pm2 restart weather-api

# Frontend
cd ..
npm install
npm run build
sudo cp -r dist/* /var/www/weather-app/
```

### Rollback

```bash
# PM2 keeps old versions
pm2 list
pm2 restart weather-api@previous

# Or restore from Git
git checkout previous-tag
# Then rebuild and restart
```

---

## 📈 Performance Optimization

### Enable Gzip in Nginx

Already included in config, but verify:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss text/javascript;
```

### Redis Session Store (Optional)

For better performance with multiple servers:

```bash
npm install connect-redis redis

# Update server.js to use Redis for sessions
```

### CDN Setup (Optional)

Use Cloudflare or AWS CloudFront for static assets.

---

## ✅ Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB authentication working
- [ ] SSL certificate installed and auto-renewal working
- [ ] PM2 running and set to start on boot
- [ ] Nginx configured and running
- [ ] Firewall configured
- [ ] Backups scheduled
- [ ] Log rotation configured
- [ ] Health checks passing
- [ ] Monitoring set up (optional: Sentry, New Relic)
- [ ] DNS pointing to server
- [ ] Email notifications working
- [ ] OAuth login tested
- [ ] 2FA working
- [ ] Performance tested (load testing)

---

## 📞 Support

If you encounter issues:

1. Check logs: PM2, Nginx, MongoDB
2. Review [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md)
3. Check [SECURITY_SETUP.md](SECURITY_SETUP.md)
4. Verify environment variables

---

**Your Weather Forecast App is now production-ready! 🎉**
