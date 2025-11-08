# EduMart Setup Instructions

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **npm** or **yarn**

## Step-by-Step Setup

### 1. Install Dependencies

#### Server Dependencies
```bash
npm install
```

#### Client Dependencies
```bash
cd client
npm install
cd ..
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `.env` file with your connection string

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edumart
JWT_SECRET=your_secret_key_here_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: 
- Replace `your_secret_key_here_change_this_in_production` with a strong random string
- For MongoDB Atlas, replace the connection string with your Atlas URI

### 4. Create Uploads Directory

The server will create the `uploads` directory automatically when you start the server, but you can create it manually:

```bash
mkdir uploads
```

### 5. Start the Application

#### Development Mode (Both Server and Client)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend client on `http://localhost:3000`

#### Or Start Separately

**Server only:**
```bash
npm run server
```

**Client only:**
```bash
npm run client
```

### 6. Access the Application

1. Open your browser and go to `http://localhost:3000`
2. The default admin account will be created automatically:
   - Email: `admin@edumart.com`
   - Password: `Admin@123`
3. **Important**: Change the admin password after first login!

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the MongoDB URI in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill
  ```

### Module Not Found Error
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  cd client
  rm -rf node_modules
  npm install
  ```

### Image Upload Not Working
- Ensure `uploads` directory exists
- Check file permissions
- Verify multer configuration in `server/middleware/upload.js`

## Production Deployment

### 1. Build the Client
```bash
cd client
npm run build
cd ..
```

### 2. Update Environment Variables
- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET`
- Update `MONGODB_URI` with production database

### 3. Serve Static Files
- The built client files will be in `client/build`
- Configure your server to serve these static files

## File Structure Notes

- All uploaded images are stored in the `uploads/` directory
- Make sure to add `uploads/` to `.gitignore` (already included)
- Database models are in `server/models/`
- API routes are in `server/routes/`
- React components are in `client/src/pages/`

## API Testing

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- The frontend application

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that all dependencies are installed

## Next Steps

1. Customize the application to your needs
2. Add more features as required
3. Set up proper error logging
4. Configure email notifications (if needed)
5. Add payment gateway integration (if needed)
6. Set up SSL certificates for production

