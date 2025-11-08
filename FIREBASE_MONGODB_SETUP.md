# Firebase & MongoDB Atlas Setup Guide

## 🔥 Firebase Setup

### 1. Firebase Configuration
Firebase has been configured in `client/src/config/firebase.js`

### 2. Install Firebase Dependencies
Run this command in the `client` directory:
```bash
cd client
npm install firebase
cd ..
```

Or from root directory:
```bash
npm run install-client
```

### 3. Firebase Storage Setup
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `edumart-e7cb9`
3. Go to **Storage** → **Get Started**
4. Choose **Start in test mode** (for development)
5. Select a location for your storage bucket
6. Click **Done**

### 4. Firebase Storage Rules (Important for Security)

Go to **Storage** → **Rules** and update with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow write access only to authenticated users
    match /products/{fileName} {
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
    
    match /avatars/{fileName} {
      allow write: if request.auth != null && request.resource.size < 2 * 1024 * 1024; // 2MB limit
    }
  }
}
```

## 🍃 MongoDB Atlas Setup

### 1. Update .env File

Open the `.env` file in the root directory and replace `YOUR_PASSWORD_HERE` with your actual MongoDB password:

```env
MONGODB_URI=mongodb+srv://arnavmarkali7_db_user:YOUR_ACTUAL_PASSWORD@cluster0.ofyt5ma.mongodb.net/edumart?retryWrites=true&w=majority
```

### 2. MongoDB Atlas Configuration Steps

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Login** to your account
3. **Get Your Password**:
   - Click on "Database Access" in the left sidebar
   - Find your user: `arnavmarkali7_db_user`
   - If you forgot the password, click "Edit" → "Edit Password" → Set a new password
   - Copy the password

4. **Whitelist Your IP Address**:
   - Click on "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your specific IP
   - Click "Confirm"

5. **Get Connection String**:
   - Click on "Clusters" in the left sidebar
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `edumart`

### 3. Update .env File with Complete Connection String

```env
MONGODB_URI=mongodb+srv://arnavmarkali7_db_user:YOUR_ACTUAL_PASSWORD@cluster0.ofyt5ma.mongodb.net/edumart?retryWrites=true&w=majority
```

**Important**: 
- Replace `YOUR_ACTUAL_PASSWORD` with your MongoDB password
- Make sure there are no spaces in the connection string
- The password should be URL-encoded if it contains special characters

## 🔄 Using Firebase Storage for Image Uploads (Optional)

If you want to use Firebase Storage instead of local file storage:

### Update Product Creation Component

You can modify `client/src/pages/Products.js` or create a product upload component that uses Firebase Storage:

```javascript
import { uploadMultipleImagesToFirebase } from '../utils/firebaseStorage';

// When uploading product images
const handleImageUpload = async (files) => {
  try {
    const imageUrls = await uploadMultipleImagesToFirebase(files, 'products');
    // Use imageUrls instead of local file paths
    console.log('Uploaded images:', imageUrls);
  } catch (error) {
    console.error('Error uploading images:', error);
  }
};
```

### Update Backend to Accept Firebase URLs

The backend already accepts image URLs in the `images` field, so you can directly use Firebase Storage URLs.

## 📝 Complete Setup Checklist

- [ ] Install Firebase dependencies: `cd client && npm install firebase`
- [ ] Set up Firebase Storage in Firebase Console
- [ ] Configure Firebase Storage rules
- [ ] Get MongoDB Atlas password
- [ ] Update `.env` file with MongoDB password
- [ ] Whitelist IP address in MongoDB Atlas
- [ ] Test MongoDB connection
- [ ] Test Firebase Storage upload

## 🧪 Testing the Setup

### Test MongoDB Connection
1. Start the server: `npm run server`
2. Check the console for: `MongoDB Connected: ...`
3. If you see an error, check your connection string and IP whitelist

### Test Firebase Storage
1. Try uploading an image through the product creation form
2. Check Firebase Console → Storage to see if files are uploaded
3. Check the browser console for any errors

## 🔒 Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Change JWT_SECRET** - Use a strong random string in production
3. **Update Firebase Storage Rules** - Restrict access appropriately
4. **Use Environment Variables** - Don't hardcode sensitive data
5. **MongoDB Password** - Use a strong password and don't share it

## 🚀 Next Steps

1. Run the application: `npm run dev`
2. Test user registration
3. Test product creation with image upload
4. Verify images are stored in Firebase Storage
5. Check data in MongoDB Atlas

## 📞 Troubleshooting

### MongoDB Connection Error
- Verify your password is correct
- Check IP whitelist in MongoDB Atlas
- Ensure the connection string is properly formatted
- Check if special characters in password are URL-encoded

### Firebase Storage Error
- Verify Firebase Storage is enabled
- Check Firebase Storage rules
- Ensure Firebase config is correct
- Check browser console for specific errors

### Image Upload Issues
- Check file size limits (5MB for products, 2MB for avatars)
- Verify Firebase Storage rules allow writes
- Check network connectivity
- Verify Firebase project is active

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Firebase Storage Guide](https://firebase.google.com/docs/storage)
- [MongoDB Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)

