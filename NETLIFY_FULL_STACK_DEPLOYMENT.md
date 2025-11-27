# Deploy Full EduMart (Frontend + Backend) on Netlify

## Overview
Netlify can host your React frontend + Node.js backend (as serverless functions) all in one place!

---

## Step 1: Update Client Environment Variables

Create `client/.env.production`:
```
REACT_APP_API_URL=https://your-site.netlify.app
```

Or during Netlify deployment, add this environment variable.

---

## Step 2: Connect to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click **"New site from Git"**
4. Search for and select **EduMart** repository
5. Click **"Connect"**

---

## Step 3: Configure Build Settings

Netlify should auto-detect, but verify these settings:

**Build Settings:**
- **Owner**: Your GitHub account
- **Branch to deploy**: `main`
- **Base directory**: (leave empty)
- **Build command**: `npm run install-all && cd client && npm run build`
- **Publish directory**: `client/build`
- **Functions directory**: `netlify/functions`

---

## Step 4: Add Environment Variables

Click **"Show advanced"** → **"Add new variable"**

Add these variables:

```
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.ofyt5ma.mongodb.net/edumart?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

NODE_ENV=production

CORS_ORIGIN=https://your-site.netlify.app

REACT_APP_API_URL=https://your-site.netlify.app
```

If using Firebase:
```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

---

## Step 5: Deploy

Click **"Deploy site"**

Netlify will:
1. Install dependencies (`npm run install-all`)
2. Build React app (`cd client && npm run build`)
3. Bundle serverless functions (`netlify/functions/`)
4. Deploy everything
5. Give you a live URL ✅

---

## After Deployment

Your app will be available at:
```
https://your-site.netlify.app
```

**API endpoints:**
```
https://your-site.netlify.app/api/health
https://your-site.netlify.app/api/products
https://your-site.netlify.app/api/auth/login
(etc.)
```

---

## Important: Update Your Backend Routes

Since APIs are served from `/.netlify/functions/api`, update your client API calls:

### Option A: Use relative URLs (Recommended)
```javascript
// No need to specify full URL
fetch('/api/products')
fetch('/api/auth/login', { method: 'POST', ... })
```

### Option B: Use environment variable
```javascript
const API_URL = process.env.REACT_APP_API_URL || '';
fetch(`${API_URL}/api/products`)
```

---

## MongoDB Connection

Make sure your `server/config/database.js` uses environment variables:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/edumart',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## Deployment Checklist

- [ ] GitHub repo connected to Netlify ✅
- [ ] Build command: `npm run install-all && cd client && npm run build`
- [ ] Publish directory: `client/build`
- [ ] Functions directory: `netlify/functions`
- [ ] MONGODB_URI added
- [ ] JWT_SECRET added
- [ ] REACT_APP_API_URL = your Netlify URL
- [ ] Deploy site
- [ ] Wait 2-5 minutes
- [ ] Visit your live URL
- [ ] Test API endpoints

---

## Troubleshooting

### Build fails
- Check Netlify build logs
- Ensure `server/package.json` exists
- Test locally: `npm run install-all`

### API endpoints not working
- Check `MONGODB_URI` is correct
- Check Netlify function logs
- Verify API routes exist in `server/routes/`

### Frontend not loading
- Clear browser cache
- Check `REACT_APP_API_URL` is set
- Check Netlify deploy logs

### MongoDB connection error
- Verify MongoDB Atlas credentials
- Check IP whitelist on MongoDB
- Test connection string locally

---

## Netlify Limits

**Free Tier:**
- 125,000 requests/month for functions
- 100 hours/month function runtime
- 1 site
- Basic analytics

**Upgrade for:**
- More function calls
- More runtime
- Custom domain
- Priority support

---

## Your Live App

Once deployed:

**Frontend:** `https://your-site.netlify.app`  
**API:** `https://your-site.netlify.app/api/*`  
**Database:** MongoDB Atlas (cloud)  
**All in one place!** 🚀

