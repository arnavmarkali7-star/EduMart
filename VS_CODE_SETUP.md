# Running EduMart in VS Code - Step by Step Guide

## Step 1: Open Project in VS Code

1. Open VS Code
2. Click `File` → `Open Folder`
3. Navigate to your `EduMart1` folder
4. Click `Select Folder`

## Step 2: Install MongoDB

### Option A: Install MongoDB Locally
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install it on your system
3. Start MongoDB service:
   - **Windows**: MongoDB should start automatically as a service
   - **Mac**: Run `brew services start mongodb-community` (if using Homebrew)
   - **Linux**: Run `sudo systemctl start mongod`

### Option B: Use MongoDB Atlas (Cloud - Recommended for beginners)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update `.env` file with your Atlas connection string

## Step 3: Create .env File

1. In VS Code, right-click on the root folder
2. Click `New File`
3. Name it `.env`
4. Add the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edumart
JWT_SECRET=edumart_secret_key_2024_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**For MongoDB Atlas**, replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/edumart?retryWrites=true&w=majority
```

## Step 4: Install Server Dependencies

1. Open terminal in VS Code: `Terminal` → `New Terminal` (or press `` Ctrl+` ``)
2. Make sure you're in the root directory (`EduMart1`)
3. Run:
```bash
npm install
```

Wait for all packages to install (this may take a few minutes).

## Step 5: Install Client Dependencies

1. In the same terminal, run:
```bash
cd client
npm install
cd ..
```

Wait for all packages to install.

## Step 6: Create Uploads Directory

The server will create this automatically, but you can create it manually:

1. In VS Code, right-click on root folder
2. Click `New Folder`
3. Name it `uploads`

## Step 7: Start the Application

### Method 1: Using npm script (Recommended)
In the terminal (root directory), run:
```bash
npm run dev
```

This will start both server and client simultaneously.

### Method 2: Start Separately (if Method 1 doesn't work)

**Terminal 1 - Server:**
```bash
npm run server
```

**Terminal 2 - Client:**
Open a new terminal (`Terminal` → `New Terminal`) and run:
```bash
cd client
npm start
```

## Step 8: Access the Application

1. Open your browser
2. Go to: `http://localhost:3000`
3. You should see the EduMart homepage

## Step 9: Test Admin Login

1. Click on `Login` in the navigation
2. Use these credentials:
   - **Email**: `admin@edumart.com`
   - **Password**: `Admin@123`
3. Click `Login`
4. You should be redirected to the dashboard

## VS Code Extensions (Optional but Recommended)

Install these extensions for better development experience:

1. **ES7+ React/Redux/React-Native snippets** - Code snippets
2. **Prettier - Code formatter** - Code formatting
3. **ESLint** - Code linting
4. **Thunder Client** or **REST Client** - API testing
5. **MongoDB for VS Code** - MongoDB integration

To install extensions:
1. Click the Extensions icon in the left sidebar (or press `Ctrl+Shift+X`)
2. Search for the extension name
3. Click `Install`

## Troubleshooting

### Issue: "Cannot find module" error
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
cd client
rm -rf node_modules
npm install
cd ..
```

### Issue: "Port 5000 already in use"
**Solution:**
1. Change PORT in `.env` file to another port (e.g., `5001`)
2. Or kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill
   ```

### Issue: "Port 3000 already in use"
**Solution:**
1. The React app will ask if you want to use a different port - type `Y`
2. Or manually set port in `client/package.json` scripts

### Issue: MongoDB connection error
**Solution:**
1. Make sure MongoDB is running
2. Check your MongoDB URI in `.env` file
3. For MongoDB Atlas, ensure your IP is whitelisted in Network Access
4. Verify your username and password are correct

### Issue: "npm run dev" doesn't work
**Solution:**
1. Make sure `concurrently` is installed: `npm install concurrently --save-dev`
2. Or start server and client separately in two terminals

### Issue: Images not uploading
**Solution:**
1. Make sure `uploads` folder exists in root directory
2. Check file permissions
3. Verify image file size is less than 5MB

## Running in Debug Mode (VS Code)

### Setup Debug Configuration

1. Click on the Debug icon in the left sidebar (or press `F5`)
2. Click "create a launch.json file"
3. Select "Node.js"
4. Add this configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Server",
      "program": "${workspaceFolder}/server/index.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

## Quick Commands Reference

```bash
# Install all dependencies
npm install && cd client && npm install && cd ..

# Start both server and client
npm run dev

# Start server only
npm run server

# Start client only
cd client && npm start

# Check if MongoDB is running
# Windows: Check Services
# Mac/Linux: sudo systemctl status mongod
```

## File Structure Quick Reference

```
EduMart1/
├── server/          # Backend code
├── client/          # Frontend code
├── uploads/         # Uploaded images (create this)
├── .env            # Environment variables (create this)
└── package.json    # Server dependencies
```

## Next Steps After Setup

1. ✅ Test the application by creating a user account
2. ✅ Add a product as a seller
3. ✅ Browse products and add to wishlist
4. ✅ Test the chat feature
5. ✅ Submit a complaint and view it in admin panel
6. ✅ Customize the application as needed

## Getting Help

If you encounter any issues:
1. Check the terminal for error messages
2. Check the browser console (F12) for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running
5. Make sure all dependencies are installed

Happy Coding! 🚀

