import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Fetch every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications?limit=10');
      setNotifications(res.data.data);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EduMart
        </Link>

        <div className="navbar-menu">
          <Link to="/products" className="navbar-link">
            Browse Products
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="navbar-link">
                  Admin Panel
                </Link>
              )}

              {(user.role === 'seller' || user.role === 'admin') && (
                <Link to="/seller/dashboard" className="navbar-link">
                  Seller Hub
                </Link>
              )}

              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>

              <div className="navbar-notifications">
                <button
                  className="notification-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>

                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="notifications-header">
                      <h3>Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead}>Mark all as read</button>
                      )}
                    </div>
                    <div className="notifications-list">
                      {notifications.length === 0 ? (
                        <p>No notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`notification-item ${!notif.read ? 'unread' : ''}`}
                            onClick={() => {
                              markAsRead(notif._id);
                              if (notif.link) {
                                navigate(notif.link);
                                setShowNotifications(false);
                              }
                            }}
                          >
                            <div className="notification-title">{notif.title}</div>
                            <div className="notification-message">{notif.message}</div>
                            <div className="notification-time">
                              {new Date(notif.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="navbar-user">
                <Link to="/profile" className="navbar-link">
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link register-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

