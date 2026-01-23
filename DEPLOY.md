# MakeMee Cosmetics - Production Deployment Guide

## Architecture Overview

```
Users → makemee.in (Vercel - Frontend)
     → admin.makemee.in (Vercel - Admin)
     → api.makemee.in (VPS - Backend) → MongoDB (VPS)
```

| Component | Tech Stack | Hosting |
|-----------|------------|---------|
| Frontend | Vite + React + React Router | Vercel (static) |
| Admin | Vite + React + MUI | Vercel (static) |
| Backend | Express.js + Node.js | VPS (Hostinger) |
| Database | MongoDB | VPS (local) |

---

## 1. Backend Deployment (VPS)

### 1.1 Server Setup

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

### 1.2 Clone & Setup

```bash
# Clone repository
cd /var/www
git clone https://github.com/Spectra4/MakeMee-Cosmatics.git
cd MakeMee-Cosmatics/server

# Install dependencies
npm install --production
```

### 1.3 Environment Variables

Create `/var/www/MakeMee-Cosmatics/server/.env`:

```env
# MongoDB (your VPS MongoDB)
MONGO_URI=mongodb://makemeeAdmin:YOUR_DB_PASSWORD@localhost:27017/makemee?authSource=admin

# JWT (generate: openssl rand -base64 32)
JWT_SECRET=YOUR_STRONG_32_CHAR_SECRET

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=makemeecosmetics@gmail.com
SMTP_PASS=YOUR_APP_PASSWORD

# Razorpay
RAZORPAY_KEY_ID=rzp_live_XXXXXX
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_SECRET

# Shiprocket
SHIPROCKET_BASE=https://apiv2.shiprocket.in/v1/external
SHIPROCKET_API_EMAIL=makemeecosmetics@gmail.com
SHIPROCKET_API_PASSWORD=YOUR_SHIPROCKET_PASSWORD

# Cloudinary
CLOUDINARY_CLOUD_NAME=dudxft40g
CLOUDINARY_API_KEY=541555522679865
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_SECRET

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID

# Server
PORT=5000
NODE_ENV=production
Admin_Email_Id=makemeecosmetics@gmail.com
```

### 1.4 Start with PM2

```bash
cd /var/www/MakeMee-Cosmatics/server

# Start the server
pm2 start api/index.js --name "makemee-api"

# Save PM2 config (survives reboot)
pm2 save
pm2 startup
```

### 1.5 Nginx Reverse Proxy

Create `/etc/nginx/sites-available/api.makemee.in`:

```nginx
server {
    listen 80;
    server_name api.makemee.in;

    location / {
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

    # Max upload size (for product images)
    client_max_body_size 10M;
}
```

Enable and secure:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/api.makemee.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.makemee.in
```

### 1.6 Firewall Setup

```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## 2. MongoDB Setup (VPS)

### 2.1 Install MongoDB

```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install
sudo apt update
sudo apt install -y mongodb-org

# Start and enable
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2.2 Secure MongoDB

```bash
mongosh

# Create admin user
use admin
db.createUser({
  user: "makemeeAdmin",
  pwd: "YOUR_STRONG_DB_PASSWORD",
  roles: ["root"]
})

# Create app database and user
use makemee
db.createUser({
  user: "makemeeApp",
  pwd: "YOUR_APP_DB_PASSWORD",
  roles: [{ role: "readWrite", db: "makemee" }]
})

exit
```

### 2.3 Enable Authentication

Edit `/etc/mongod.conf`:

```yaml
security:
  authorization: enabled
```

```bash
sudo systemctl restart mongod
```

### 2.4 Update Connection String

In server `.env`:
```
MONGO_URI=mongodb://makemeeApp:YOUR_APP_DB_PASSWORD@localhost:27017/makemee
```

---

## 3. Frontend Deployment (Vercel)

### 3.1 Prepare Environment

Create `client/.env.production`:

```env
VITE_API_BASE_URL=https://api.makemee.in/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXX
```

### 3.2 Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import from GitHub: `Spectra4/MakeMee-Cosmatics`
4. Configure project:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   - `VITE_API_BASE_URL` = `https://api.makemee.in/api`
   - `VITE_GOOGLE_CLIENT_ID` = your Google client ID
   - `VITE_RAZORPAY_KEY_ID` = your Razorpay key
6. Click "Deploy"

### 3.3 Domain Setup

1. Go to Project Settings → Domains
2. Add `makemee.in`
3. Add `www.makemee.in`
4. Follow Vercel's DNS instructions

---

## 4. Admin Panel Deployment (Vercel)

### 4.1 Create Separate Project

The admin panel should be a **separate Vercel project** for security.

### 4.2 Prepare Environment

Create `admin/.env.production`:

```env
VITE_API_BASE_URL=https://api.makemee.in/api
```

### 4.3 Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project" (new project, not same as frontend)
3. Import same repo: `Spectra4/MakeMee-Cosmatics`
4. Configure project:
   - **Root Directory**: `admin`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_API_BASE_URL` = `https://api.makemee.in/api`
6. Click "Deploy"

### 4.4 Domain Setup

1. Go to Project Settings → Domains
2. Add `admin.makemee.in`
3. Follow Vercel's DNS instructions

### 4.5 Admin Security

1. **Change default admin password** (default is `Admin@123`)
   ```bash
   cd server && node scripts/createAdmin.js
   ```
2. Consider adding IP allowlist via Vercel Edge Config (advanced)
3. Use strong, unique password

---

## 5. DNS Configuration

Add these records at your domain registrar:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | api | `YOUR_VPS_IP` | 300 |
| CNAME | @ | `cname.vercel-dns.com` | 300 |
| CNAME | www | `cname.vercel-dns.com` | 300 |
| CNAME | admin | `cname.vercel-dns.com` | 300 |

Note: Vercel may provide different values - follow their dashboard instructions.

---

## 6. Post-Deployment Checklist

### Backend (VPS)
- [ ] MongoDB running with authentication enabled
- [ ] PM2 running `makemee-api` process
- [ ] Nginx configured and SSL active
- [ ] All API credentials rotated (new secrets)
- [ ] `NODE_ENV=production` set in .env
- [ ] Firewall configured (only 22, 80, 443 open)
- [ ] Server responds at `https://api.makemee.in`

### Frontend (Vercel)
- [ ] Build succeeds without errors
- [ ] Environment variables configured
- [ ] Domain `makemee.in` verified and active
- [ ] HTTPS working
- [ ] API calls working (check browser console)

### Admin (Vercel)
- [ ] Separate Vercel project created
- [ ] Domain `admin.makemee.in` verified
- [ ] Admin login works
- [ ] Default password changed

### Integration Testing
- [ ] User registration (email + Google OAuth)
- [ ] User login
- [ ] Product listing and details
- [ ] Add to cart
- [ ] Checkout flow
- [ ] Razorpay payment (test mode first)
- [ ] Order confirmation email
- [ ] Admin: view orders
- [ ] Admin: update order status
- [ ] Shiprocket shipment creation

---

## 7. Updating Production

### Backend Update

```bash
ssh user@your-vps
cd /var/www/MakeMee-Cosmatics
git pull origin main
cd server
npm install --production
pm2 restart makemee-api
```

### Frontend/Admin Update

Simply push to `main` branch - Vercel auto-deploys.

To trigger manual deploy:
```bash
cd client  # or admin
vercel --prod
```

---

## 8. Monitoring & Logs

### PM2 Logs (Backend)

```bash
# View logs
pm2 logs makemee-api

# Monitor
pm2 monit

# Status
pm2 status
```

### Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

### Vercel Logs

View in Vercel Dashboard → Project → Deployments → Select deployment → Logs

---

## 9. Rollback

### Backend

```bash
cd /var/www/MakeMee-Cosmatics
git log --oneline -5  # Find previous commit
git checkout <commit-hash>
pm2 restart makemee-api
```

### Frontend/Admin (Vercel)

1. Go to Vercel Dashboard
2. Select project
3. Go to Deployments
4. Find previous deployment
5. Click "..." → "Promote to Production"

---

## 10. Credentials Rotation Checklist

Before going live, rotate ALL these credentials:

| Service | Action | Dashboard URL |
|---------|--------|---------------|
| JWT Secret | Generate new | `openssl rand -base64 32` |
| Razorpay | New API keys | https://dashboard.razorpay.com/app/keys |
| Cloudinary | Regenerate secret | https://console.cloudinary.com/settings |
| Gmail | New app password | https://myaccount.google.com/apppasswords |
| Shiprocket | Change password | https://app.shiprocket.in/settings |
| MongoDB | Set strong password | During setup |
| Admin | Change default password | Via createAdmin.js script |

---

## Quick Reference

| Service | URL | Location |
|---------|-----|----------|
| Frontend | https://makemee.in | Vercel |
| Admin | https://admin.makemee.in | Vercel |
| API | https://api.makemee.in | VPS |
| MongoDB | localhost:27017 | VPS (internal only) |

| Command | Purpose |
|---------|---------|
| `pm2 restart makemee-api` | Restart backend |
| `pm2 logs makemee-api` | View backend logs |
| `sudo certbot renew` | Renew SSL (auto via cron) |
| `git pull origin main` | Update code on VPS |
