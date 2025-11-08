# EduMart - College Students Second Hand Product Exchange Platform

## Project Overview
EduMart is a platform where college students can exchange second-hand products. The platform includes user panels, admin panels, and seller hubs with comprehensive features.

## Features

### User Panel
- Browse products with advanced filters
- Product ratings and feedback
- Wishlist functionality
- Real-time chat with other users
- Order management
- Complaint submission
- User profile
- Notifications

### Admin Panel
- View all users and their details
- Manage products
- View ratings and feedback
- Handle user complaints

### Seller Hub
- Dashboard with analytics:
  - Total revenue
  - Total sales
  - Active listings
  - Average rating
  - Sales overview
- Manage listings
- View complaints

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io for chat
- **File Upload**: Multer (local) or Firebase Storage (cloud)
- **Cloud Storage**: Firebase Storage (for images)
- **Hosting**: MongoDB Atlas (cloud database)

## Installation

### Quick Setup

1. **Install Dependencies**:
```bash
# Install server dependencies
npm install

# Install client dependencies (including Firebase)
cd client
npm install
cd ..
```

2. **Set Up Environment Variables**:

   **Option A: Use the setup script** (Recommended)
   ```bash
   node setup-env.js
   ```
   Enter your MongoDB Atlas password when prompted.

   **Option B: Manual Setup**
   - Create a `.env` file in the root directory
   - Copy content from `.env.example`
   - Replace `YOUR_PASSWORD_HERE` with your MongoDB Atlas password

   Example `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://arnavmarkali7_db_user:YOUR_PASSWORD@cluster0.ofyt5ma.mongodb.net/edumart?retryWrites=true&w=majority
   JWT_SECRET=edumart_secret_key_2024_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. **Set Up MongoDB Atlas**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Login and go to "Network Access"
   - Add your IP address (or "Allow Access from Anywhere" for development)
   - Get your password from "Database Access"

4. **Set Up Firebase Storage** (Optional but Recommended):
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project: `edumart-e7cb9`
   - Enable Storage
   - Configure storage rules (see `FIREBASE_MONGODB_SETUP.md`)

5. **Run the Application**:
```bash
npm run dev
```

The server will run on `http://localhost:5000` and the client on `http://localhost:3000`

### Detailed Setup Guides

- **Quick Start**: See `QUICK_START.md` for step-by-step setup
- **VS Code Setup**: See `VS_CODE_SETUP.md` for VS Code specific instructions
- **Firebase & MongoDB**: See `FIREBASE_MONGODB_SETUP.md` for detailed configuration

## Project Structure

```
EduMart1/
├── server/
│   ├── index.js
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Chat.js
│   │   ├── Complaint.js
│   │   ├── Wishlist.js
│   │   └── Rating.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── chat.js
│   │   ├── complaints.js
│   │   ├── wishlist.js
│   │   ├── ratings.js
│   │   └── admin.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── chatController.js
│   │   ├── complaintController.js
│   │   ├── wishlistController.js
│   │   ├── ratingController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   └── utils/
│       └── generateToken.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── package.json
```

## Default Admin Credentials
- Email: admin@edumart.com
- Password: Admin@123

**Note**: Change the default admin password after first login.

