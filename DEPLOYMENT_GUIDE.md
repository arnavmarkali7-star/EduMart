# Deployment Guide for EduMart

## Frontend Deployment (Vercel)

### Steps:
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your EduMart repository
5. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variables from your `.env` file
7. Click Deploy

**Frontend URL**: Will be provided by Vercel

---

## Backend Deployment (Render.com)

### Steps:
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +"
4. Select "Web Service"
5. Connect your GitHub repository
6. Configure:
   - **Name**: `edumart-backend`
   - **Environment**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
7. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```
8. Click Deploy

**Backend URL**: Will be provided by Render

---

## Update Frontend .env

After deployment, update `client/.env`:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

---

## Database Setup

### MongoDB Atlas:
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Add to backend `.env` as `MONGODB_URI`

---

## GitHub Actions (CI/CD)

The `.github/workflows/deploy.yml` file automatically:
- Runs on every push to main
- Installs dependencies
- Builds the frontend
- Deploys to GitHub Pages (optional)

---

## Quick Checklist

- [ ] Push code to GitHub ✅
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Setup MongoDB Atlas
- [ ] Add environment variables
- [ ] Test the deployed app
- [ ] Update README with live URLs

