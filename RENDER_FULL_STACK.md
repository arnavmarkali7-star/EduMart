# Deploy Full EduMart (Frontend + Backend) on Render

## Overview
Deploy both React frontend and Node.js backend on Render using a single service or two separate services.

---

## Option 1: Single Service (Recommended - Easier)

Deploy everything from one Render service that serves both frontend and backend.

### Step 1: Update Server to Serve Static Frontend

We'll make the backend serve the React build folder.

Update your `server/index.js`:

```javascript
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Serve React app for all other routes (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🎯 Server running on port ${PORT}`);
});
```

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Select your **EduMart** repository
4. Configure:
   - **Name**: `edumart`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `npm install && cd client && npm install && cd client && npm run build`
   - **Start Command**: `cd server && node index.js`
   - **Plan**: Free or Paid

### Step 3: Add Environment Variables

```
MONGODB_URI
mongodb+srv://<db_username>:<db_password>@cluster0.ofyt5ma.mongodb.net/edumart?retryWrites=true&w=majority

JWT_SECRET
your_super_secret_jwt_key_here

NODE_ENV
production

PORT
10000

CORS_ORIGIN
https://your-render-domain.onrender.com
```

### Step 4: Deploy

Click **"Create Web Service"** and wait for deployment.

Your app will be available at:
```
https://your-render-domain.onrender.com
```

All routes (frontend + API) will work from this single URL!

---

## Option 2: Separate Services (Advanced)

Deploy frontend and backend as separate Render services.

### Frontend Service:

1. Create new Web Service
2. Build Command: `cd client && npm run build`
3. Start Command: `npx serve -s build -l 3000`
4. Environment: 
   ```
   REACT_APP_API_URL=https://your-backend-render-url.onrender.com
   ```

### Backend Service:

1. Create new Web Service
2. Build Command: `cd server && npm install`
3. Start Command: `cd server && node index.js`
4. Environment variables (same as Option 1)

---

## Recommended: Option 1 (Single Service)

**Advantages:**
- ✅ Simpler setup
- ✅ Single URL for everything
- ✅ No CORS issues
- ✅ Easier to manage
- ✅ Better performance

**Build time:** ~5 minutes  
**Cost:** Free tier available

---

## Your Deployment Checklist

- [ ] Update `server/index.js` to serve static frontend
- [ ] Create Render Web Service
- [ ] Select EduMart repository
- [ ] Set build command: `npm install && cd client && npm install && cd client && npm run build`
- [ ] Set start command: `cd server && node index.js`
- [ ] Add all environment variables
- [ ] Create Web Service
- [ ] Wait 5 minutes for deployment
- [ ] Visit your Render URL
- [ ] Test frontend and API

---

## After Deployment

Your single URL will serve:
- ✅ React frontend
- ✅ Backend API at `/api/*`
- ✅ Database (MongoDB Atlas)

**Everything in ONE place!** 🚀

