# 🚀 Quick Start Guide - EduMart in VS Code

## Step 1: Install Dependencies

Open terminal in VS Code (`Ctrl + ~`) and run:

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

## Step 2: Set Up MongoDB Atlas

1. **Get your MongoDB password**:
   - Go to: https://cloud.mongodb.com/
   - Login to your account
   - Go to "Database Access"
   - Find user: `arnavmarkali7_db_user`
   - Click "Edit" → Set/Reset password
   - Copy the password

2. **Whitelist your IP**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

3. **Update .env file**:
   - Open `.env` file in VS Code
   - Replace `YOUR_PASSWORD_HERE` with your actual MongoDB password
   - Save the file

Example:
```env
MONGODB_URI=mongodb+srv://arnavmarkali7_db_user:MyPassword123@cluster0.ofyt5ma.mongodb.net/edumart?retryWrites=true&w=majority
```

## Step 3: Set Up Firebase Storage (Optional but Recommended)

1. **Install Firebase**:
```bash
cd client
npm install firebase
cd ..
```

2. **Enable Firebase Storage**:
   - Go to: https://console.firebase.google.com/
   - Select project: `edumart-e7cb9`
   - Go to "Storage" → "Get Started"
   - Choose "Start in test mode"
   - Select location
   - Click "Done"

3. **Update Storage Rules** (see FIREBASE_MONGODB_SETUP.md for details)

## Step 4: Start the Application

In VS Code terminal (root directory), run:

```bash
npm run dev
```

This will start:
- ✅ Backend server on `http://localhost:5000`
- ✅ Frontend app on `http://localhost:3000`

## Step 5: Access the Application

1. Open browser: `http://localhost:3000`
2. You should see the EduMart homepage

## Step 6: Test Admin Login

1. Click "Login" in navigation
2. Use credentials:
   - **Email**: `admin@edumart.com`
   - **Password**: `Admin@123`
3. Login and explore!

## ✅ What You Should See

- ✅ Homepage with featured products
- ✅ Navigation bar with login/register
- ✅ Admin dashboard (after login as admin)
- ✅ User dashboard (after registration/login)
- ✅ Product browsing with filters
- ✅ Seller hub (if you're a seller)

## 🐛 Troubleshooting

### "Cannot find module" error
```bash
rm -rf node_modules
npm install
cd client
rm -rf node_modules
npm install
cd ..
```

### "Port already in use" error
- Change PORT in `.env` file to `5001`
- Or kill the process using the port

### MongoDB connection error
- Check your password in `.env` file
- Verify IP is whitelisted in MongoDB Atlas
- Check connection string format

### Firebase errors
- Make sure Firebase is installed: `cd client && npm install firebase`
- Check Firebase Storage is enabled
- Verify Firebase config in `client/src/config/firebase.js`

## 📁 Important Files

- `.env` - Environment variables (MongoDB URI, JWT secret)
- `client/src/config/firebase.js` - Firebase configuration
- `server/index.js` - Backend server
- `client/src/App.js` - Frontend app

## 🎯 Next Steps

1. ✅ Test user registration
2. ✅ Create a product
3. ✅ Browse products
4. ✅ Add to wishlist
5. ✅ Test chat feature
6. ✅ Submit a complaint
7. ✅ Explore admin panel

## 📚 Documentation

- `VS_CODE_SETUP.md` - Detailed VS Code setup
- `FIREBASE_MONGODB_SETUP.md` - Firebase & MongoDB setup
- `PROJECT_STRUCTURE.md` - Complete file structure
- `README.md` - Project overview

## 💡 Tips

- Use VS Code's integrated terminal (`Ctrl + ~`)
- Check the terminal for error messages
- Use browser console (F12) for frontend errors
- MongoDB Atlas has a free tier (512MB)
- Firebase has a free tier (5GB storage)

Happy Coding! 🎉

