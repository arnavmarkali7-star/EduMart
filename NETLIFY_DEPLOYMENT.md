# Netlify Deployment Guide

## Deploy EduMart Frontend on Netlify

### Step 1: Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click **"Sign Up"** (sign in with GitHub)
3. Authorize Netlify to access your GitHub repositories

### Step 2: Connect Your Repository
1. Click **"New site from Git"**
2. Choose **GitHub** as your provider
3. Search for and select your **EduMart** repository
4. Click **"Connect"**

### Step 3: Configure Build Settings
Netlify will auto-detect settings, but verify:
- **Owner**: Your GitHub account
- **Branch to deploy**: `main`
- **Build command**: `cd client && npm run build`
- **Publish directory**: `client/build`
- **Base directory**: Leave empty (or `.`)

### Step 4: Add Environment Variables
Before deploying, add your environment variables:

1. Go to **Site Settings** → **Build & Deploy** → **Environment**
2. Click **"Edit variables"**
3. Add these environment variables:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_FIREBASE_API_KEY=your_firebase_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

### Step 5: Deploy
1. Click **"Deploy site"**
2. Netlify will automatically:
   - Build your React app
   - Optimize assets
   - Deploy to CDN
   - Provide a live URL

### After Deployment

Your site will be available at a URL like:
```
https://[your-site-name].netlify.app
```

#### Custom Domain (Optional)
1. Go to **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain
4. Follow DNS configuration steps

#### Enable HTTPS (Automatic)
Netlify automatically provides free SSL/TLS certificates via Let's Encrypt.

---

## Continuous Deployment

Once connected, every push to `main` branch will:
1. ✅ Trigger a new build
2. ✅ Run tests (if configured)
3. ✅ Deploy automatically
4. ✅ Provide deploy preview for pull requests

---

## Backend Integration

For your full-stack app:
1. **Deploy backend** on Render, Railway, or Heroku (not Netlify)
2. **Update** `REACT_APP_API_URL` with your backend URL
3. **Configure CORS** on your backend to allow Netlify domain

### Backend CORS Setup (Express)
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://your-site.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
```

---

## Troubleshooting

### Build Fails
- Check **Deploy logs** in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

### API Not Working
- Verify `REACT_APP_API_URL` is correct
- Check backend is running
- Confirm CORS is enabled on backend

### Environment Variables Not Loading
- Redeploy after adding variables
- Check variable names start with `REACT_APP_`
- Clear browser cache

---

## Deployment Checklist

- [ ] Connect GitHub to Netlify
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy frontend
- [ ] Deploy backend (Render/Heroku)
- [ ] Update backend CORS
- [ ] Test all features
- [ ] Add custom domain (optional)
- [ ] Setup monitoring & logs

