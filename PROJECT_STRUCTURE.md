# EduMart Project Structure

## Complete File Structure

```
EduMart1/
│
├── server/                          # Backend Server
│   ├── index.js                     # Main server file
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── models/                      # MongoDB Models
│   │   ├── User.js                  # User model (user, admin, seller)
│   │   ├── Product.js               # Product model
│   │   ├── Order.js                 # Order model
│   │   ├── Chat.js                  # Chat model
│   │   ├── Complaint.js             # Complaint model
│   │   ├── Wishlist.js              # Wishlist model
│   │   ├── Rating.js                # Rating model
│   │   └── Notification.js          # Notification model
│   ├── controllers/                 # Route Controllers
│   │   ├── authController.js        # Authentication (login, register, profile)
│   │   ├── productController.js     # Product CRUD operations
│   │   ├── orderController.js       # Order management
│   │   ├── chatController.js        # Chat functionality
│   │   ├── complaintController.js   # Complaint handling
│   │   ├── wishlistController.js    # Wishlist operations
│   │   ├── ratingController.js      # Rating & reviews
│   │   ├── adminController.js       # Admin operations
│   │   ├── sellerController.js      # Seller dashboard
│   │   └── notificationController.js # Notifications
│   ├── routes/                      # API Routes
│   │   ├── auth.js                  # /api/auth
│   │   ├── products.js              # /api/products
│   │   ├── orders.js                # /api/orders
│   │   ├── chat.js                  # /api/chat
│   │   ├── complaints.js            # /api/complaints
│   │   ├── wishlist.js              # /api/wishlist
│   │   ├── ratings.js               # /api/ratings
│   │   ├── admin.js                 # /api/admin
│   │   ├── seller.js                # /api/seller
│   │   └── notifications.js         # /api/notifications
│   ├── middleware/                  # Middleware
│   │   ├── auth.js                  # Authentication & authorization
│   │   └── upload.js                # File upload (Multer)
│   └── utils/
│       └── generateToken.js         # JWT token generation
│
├── client/                          # Frontend React App
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── src/
│   │   ├── index.js                 # React entry point
│   │   ├── index.css                # Global styles
│   │   ├── App.js                   # Main App component
│   │   ├── components/              # Reusable Components
│   │   │   ├── Navbar.js            # Navigation bar
│   │   │   ├── Navbar.css
│   │   │   └── PrivateRoute.js      # Protected routes
│   │   ├── context/                 # React Context
│   │   │   └── AuthContext.js       # Authentication context
│   │   ├── pages/                   # Page Components
│   │   │   ├── Home.js              # Home page
│   │   │   ├── Home.css
│   │   │   ├── Login.js             # Login page
│   │   │   ├── Register.js          # Registration page
│   │   │   ├── Auth.css             # Auth pages styles
│   │   │   ├── Products.js          # Products listing
│   │   │   ├── Products.css
│   │   │   ├── ProductDetail.js     # Product details
│   │   │   ├── ProductDetail.css
│   │   │   ├── user/                # User Pages
│   │   │   │   ├── Dashboard.js     # User dashboard
│   │   │   │   ├── Dashboard.css
│   │   │   │   ├── Profile.js       # User profile
│   │   │   │   ├── Profile.css
│   │   │   │   ├── MyOrders.js      # User orders
│   │   │   │   ├── MyOrders.css
│   │   │   │   ├── MyWishlist.js    # User wishlist
│   │   │   │   ├── MyWishlist.css
│   │   │   │   ├── MyChat.js        # User chat
│   │   │   │   ├── MyChat.css
│   │   │   │   ├── MyComplaints.js  # User complaints
│   │   │   │   └── MyComplaints.css
│   │   │   ├── admin/               # Admin Pages
│   │   │   │   ├── Dashboard.js     # Admin dashboard
│   │   │   │   ├── Dashboard.css
│   │   │   │   ├── Users.js         # User management
│   │   │   │   ├── Users.css
│   │   │   │   ├── Products.js      # Product management
│   │   │   │   ├── Products.css
│   │   │   │   ├── Complaints.js    # Complaint management
│   │   │   │   ├── Complaints.css
│   │   │   │   ├── Ratings.js       # Ratings & feedback
│   │   │   │   └── Ratings.css
│   │   │   └── seller/              # Seller Pages
│   │   │       ├── Dashboard.js     # Seller dashboard
│   │   │       ├── Dashboard.css
│   │   │       ├── Products.js      # Seller products
│   │   │       ├── Products.css
│   │   │       ├── Orders.js        # Seller orders
│   │   │       └── Orders.css
│   │   └── services/                # API Services (if needed)
│   ├── package.json                 # Client dependencies
│   └── .gitignore                   # Client gitignore
│
├── uploads/                         # Uploaded files (images)
├── .env                            # Environment variables (create this)
├── .env.example                    # Environment variables example
├── .gitignore                      # Git ignore file
├── package.json                    # Server dependencies
└── README.md                       # Project documentation
```

## Key Features by File

### Backend (Server)

1. **Authentication** (`server/routes/auth.js`)
   - User registration
   - User login
   - Profile management
   - Password change

2. **Products** (`server/routes/products.js`)
   - Browse products with filters
   - Create/Update/Delete products
   - Get product details
   - Seller's products

3. **Orders** (`server/routes/orders.js`)
   - Create orders
   - View orders (buyer/seller)
   - Update order status

4. **Chat** (`server/routes/chat.js`)
   - Real-time messaging
   - Chat history
   - Mark as read

5. **Complaints** (`server/routes/complaints.js`)
   - Submit complaints
   - View complaints
   - Admin response

6. **Wishlist** (`server/routes/wishlist.js`)
   - Add to wishlist
   - Remove from wishlist
   - View wishlist

7. **Ratings** (`server/routes/ratings.js`)
   - Rate products
   - View ratings
   - Reviews

8. **Admin** (`server/routes/admin.js`)
   - Dashboard statistics
   - User management
   - Product management
   - Complaint management
   - Ratings & feedback

9. **Seller** (`server/routes/seller.js`)
   - Seller dashboard
   - Revenue tracking
   - Sales overview
   - Product management
   - Order management

10. **Notifications** (`server/routes/notifications.js`)
    - Get notifications
    - Mark as read
    - Delete notifications

### Frontend (Client)

1. **Public Pages**
   - Home: Landing page with featured products
   - Products: Browse with filters
   - Product Detail: View product, ratings, reviews
   - Login/Register: Authentication

2. **User Panel**
   - Dashboard: Overview of user features
   - Profile: Update profile and password
   - My Orders: View order history
   - My Wishlist: Saved products
   - My Chat: Real-time messaging
   - My Complaints: Submit and view complaints

3. **Admin Panel**
   - Dashboard: Statistics and overview
   - Users: User management
   - Products: Product management
   - Complaints: Complaint handling
   - Ratings: View all ratings and feedback

4. **Seller Hub**
   - Dashboard: Revenue, sales, analytics
   - Products: Manage listings
   - Orders: Manage orders

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (seller)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/my-products` - Get seller's products

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

### Chat
- `GET /api/chat` - Get all chats
- `GET /api/chat/:userId` - Get or create chat
- `POST /api/chat/:chatId/message` - Send message
- `PUT /api/chat/:chatId/read` - Mark as read

### Complaints
- `POST /api/complaints` - Submit complaint
- `GET /api/complaints/my-complaints` - Get user's complaints
- `GET /api/complaints/:id` - Get complaint details
- `PUT /api/complaints/:id/status` - Update complaint (admin)

### Wishlist
- `POST /api/wishlist` - Add to wishlist
- `GET /api/wishlist` - Get wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist
- `DELETE /api/wishlist/product/:productId` - Remove by product

### Ratings
- `POST /api/ratings` - Create/update rating
- `GET /api/ratings/product/:productId` - Get product ratings
- `GET /api/ratings/my-ratings` - Get user's ratings
- `DELETE /api/ratings/:id` - Delete rating

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/products` - Get all products
- `GET /api/admin/complaints` - Get all complaints
- `GET /api/admin/ratings` - Get all ratings

### Seller
- `GET /api/seller/dashboard` - Seller dashboard
- `GET /api/seller/products` - Seller's products
- `GET /api/seller/orders` - Seller's orders

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Database Models

1. **User**: name, email, password, role, phone, college, avatar, isActive
2. **Product**: name, description, category, price, condition, images, seller, status
3. **Order**: buyer, seller, products, totalAmount, status, paymentMethod
4. **Chat**: participants, messages, lastMessage, lastMessageTime
5. **Complaint**: user, type, subject, description, status, adminResponse
6. **Wishlist**: user, product
7. **Rating**: user, product, rating, review
8. **Notification**: user, type, title, message, link, read

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edumart
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## Installation & Setup

1. Install server dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
cd ..
```

3. Create `.env` file with your MongoDB URI and JWT secret

4. Start MongoDB service

5. Run the application:
```bash
npm run dev
```

This will start both server (port 5000) and client (port 3000)

## Default Admin Credentials

- Email: admin@edumart.com
- Password: Admin@123

**Important**: Change the default admin password after first login!

