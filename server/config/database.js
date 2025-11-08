const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edumart', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create default admin user if it doesn't exist
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    
    const adminExists = await User.findOne({ email: 'admin@edumart.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@edumart.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

