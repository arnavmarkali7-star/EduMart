import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Welcome, {user?.name}!</h1>
        
        <div className="dashboard-grid">
          <Link to="/products" className="dashboard-card">
            <div className="card-icon">🛍️</div>
            <h3>Browse Products</h3>
            <p>Explore second-hand products from college students</p>
          </Link>

          <Link to="/sell-product" className="dashboard-card">
            <div className="card-icon">💰</div>
            <h3>Sell Product</h3>
            <p>List your product for sale to other students</p>
          </Link>

          {(user?.role === 'seller' || user?.role === 'admin') && (
            <Link to="/my-products" className="dashboard-card">
              <div className="card-icon">📦</div>
              <h3>My Products</h3>
              <p>Manage your listed products</p>
            </Link>
          )}

          <Link to="/my-orders" className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>My Orders</h3>
            <p>View and manage your orders</p>
          </Link>

          <Link to="/my-wishlist" className="dashboard-card">
            <div className="card-icon">❤️</div>
            <h3>My Wishlist</h3>
            <p>See your saved products</p>
          </Link>

          <Link to="/my-chat" className="dashboard-card">
            <div className="card-icon">💬</div>
            <h3>My Chat</h3>
            <p>Chat with sellers and buyers</p>
          </Link>

          <Link to="/my-complaints" className="dashboard-card">
            <div className="card-icon">📝</div>
            <h3>My Complaints</h3>
            <p>View your complaints and their status</p>
          </Link>

          <Link to="/profile" className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>Profile</h3>
            <p>Manage your profile settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;