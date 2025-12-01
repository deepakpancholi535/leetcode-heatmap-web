# 🚀 Complete Render Deployment Guide

Step-by-step guide to deploy your LeetCode Heatmap app on Render.

## Prerequisites

- [x] GitHub account
- [x] Render account (free tier available)
- [x] MongoDB Atlas account (or Render MongoDB)

## Step 1: Setup MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for free account
3. Verify email

### 1.2 Create Database Cluster
1. Click **Build a Database**
2. Choose **FREE** tier (M0 Sandbox)
3. Select cloud provider: **AWS**
4. Choose region closest to you
5. Cluster name: `leetcode-heatmap`
6. Click **Create**

### 1.3 Create Database User
1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Authentication Method: **Password**
4. Username: `leetcode-admin`
5. Password: Generate secure password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click **Add User**

### 1.4 Configure Network Access
1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
4. Confirm: This is required for Render
5. Click **Confirm**

### 1.5 Get Connection String
1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. Copy connection string:
```
mongodb+srv://leetcode-admin:<password>@leetcode-heatmap.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
6. Replace `<password>` with your actual password
7. Add database name before `?`:
```
mongodb+srv://leetcode-admin:YOUR_PASSWORD@leetcode-heatmap.xxxxx.mongodb.net/leetcode-heatmap?retryWrites=true&w=majority
```

## Step 2: Prepare GitHub Repository

### 2.1 Ensure All Files Are Committed
```bash
git status
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2.2 Verify Required Files
Ensure these files exist:
- [x] `package.json` (root)
- [x] `client/package.json`
- [x] `server/index.js`
- [x] `.gitignore`
- [x] `README.md`

## Step 3: Deploy on Render

### 3.1 Create Render Account
1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access repositories

### 3.2 Create New Web Service
1. Click **New +** → **Web Service**
2. Connect repository: `leetcode-heatmap-web`
3. Click **Connect**

### 3.3 Configure Web Service

**Basic Settings:**
- **Name**: `leetcode-heatmap` (or your preferred name)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Environment**: `Node`
- **Build Command**: 
  ```bash
  npm install && cd client && npm install && npm run build
  ```
- **Start Command**: 
  ```bash
  npm start
  ```

**Instance Type:**
- Select **Free** tier

### 3.4 Add Environment Variables

Click **Advanced** → **Add Environment Variable**

Add these variables:

1. **MONGODB_URI**
   ```
   mongodb+srv://leetcode-admin:YOUR_PASSWORD@leetcode-heatmap.xxxxx.mongodb.net/leetcode-heatmap?retryWrites=true&w=majority
   ```

2. **JWT_SECRET**
   ```
   your-super-secret-production-jwt-key-change-this-to-random-string
   ```
   Generate random string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **NODE_ENV**
   ```
   production
   ```

4. **PORT** (Optional - Render sets this automatically)
   ```
   10000
   ```

### 3.5 Deploy
1. Click **Create Web Service**
2. Wait for deployment (5-10 minutes)
3. Watch build logs for errors

## Step 4: Verify Deployment

### 4.1 Check Build Logs
- Look for "Build successful"
- Check for any errors

### 4.2 Test Application
1. Click on your app URL: `https://leetcode-heatmap.onrender.com`
2. Test registration
3. Test login
4. Link LeetCode account
5. Verify heatmap loads

### 4.3 Test API Endpoints
```bash
# Health check
curl https://your-app.onrender.com/health

# Should return: {"status":"ok","timestamp":"..."}
```

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain
1. In Render dashboard, go to **Settings**
2. Scroll to **Custom Domain**
3. Click **Add Custom Domain**
4. Enter your domain: `leetcode.yourdomain.com`

### 5.2 Configure DNS
Add CNAME record in your DNS provider:
```
Type: CNAME
Name: leetcode (or your subdomain)
Value: your-app.onrender.com
TTL: 3600
```

### 5.3 Enable HTTPS
- Render automatically provisions SSL certificate
- Wait 5-10 minutes for certificate

## Step 6: Monitoring & Maintenance

### 6.1 View Logs
1. Go to **Logs** tab in Render dashboard
2. Monitor for errors
3. Check application performance

### 6.2 Auto-Deploy
- Render automatically deploys on git push to main
- Disable in **Settings** if needed

### 6.3 Manual Deploy
1. Go to **Manual Deploy**
2. Click **Deploy latest commit**

## Troubleshooting

### Build Fails

**Error: Cannot find module**
```bash
# Solution: Check package.json dependencies
npm install
```

**Error: Build command failed**
```bash
# Verify build command:
npm install && cd client && npm install && npm run build
```

### Application Crashes

**Error: MongoDB connection failed**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Ensure database user has correct permissions

**Error: Port already in use**
- Remove PORT from environment variables
- Let Render assign port automatically

### Slow Performance

**Free tier limitations:**
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Upgrade to paid tier for always-on service

### API Not Working

**CORS errors:**
- Check CORS configuration in `server/index.js`
- Ensure frontend URL is allowed

**JWT errors:**
- Verify JWT_SECRET is set
- Check token expiration

## Performance Optimization

### 1. Enable Caching
Add to `server/index.js`:
```javascript
app.use(express.static('client/build', {
  maxAge: '1d'
}));
```

### 2. Compress Responses
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Database Indexing
Add indexes in MongoDB:
```javascript
// In User model
userSchema.index({ email: 1 });
userSchema.index({ leetcodeUsername: 1 });
```

## Scaling

### Upgrade to Paid Plan
**Starter Plan ($7/month):**
- Always-on (no spin-down)
- 512 MB RAM
- Better performance

**Standard Plan ($25/month):**
- 2 GB RAM
- Auto-scaling
- Priority support

### Horizontal Scaling
- Add more instances
- Use load balancer
- Implement Redis for sessions

## Backup Strategy

### 1. MongoDB Backups
- MongoDB Atlas: Automatic backups (free tier)
- Download backups regularly

### 2. Code Backups
- GitHub repository (already backed up)
- Clone to local machine

### 3. Environment Variables
- Save .env file securely offline
- Use password manager

## Security Checklist

- [x] HTTPS enabled (automatic on Render)
- [x] Environment variables secured
- [x] MongoDB credentials protected
- [x] JWT secret is strong and random
- [x] Rate limiting enabled
- [x] Helmet security headers
- [x] Input validation
- [x] Password hashing

## Cost Breakdown

**Free Tier:**
- Render Web Service: $0
- MongoDB Atlas M0: $0
- **Total: $0/month**

**Limitations:**
- Spins down after 15 min inactivity
- 750 hours/month free
- 100 GB bandwidth

**Paid Tier (Recommended for production):**
- Render Starter: $7/month
- MongoDB Atlas M10: $9/month
- **Total: $16/month**

## Next Steps

1. ✅ Monitor application logs
2. ✅ Set up error tracking (Sentry)
3. ✅ Add analytics (Google Analytics)
4. ✅ Create backup strategy
5. ✅ Plan for scaling

## Support

**Render Support:**
- [Render Docs](https://render.com/docs)
- [Community Forum](https://community.render.com)

**MongoDB Support:**
- [MongoDB Docs](https://docs.mongodb.com)
- [Atlas Support](https://www.mongodb.com/cloud/atlas/support)

---

**Deployment Complete! 🎉**

Your app is now live at: `https://your-app-name.onrender.com`

Share it with the world! 🚀
