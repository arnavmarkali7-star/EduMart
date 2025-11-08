import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/seller/dashboard');
      setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="seller-dashboard">
      <div className="container">
        <h1>Seller Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p>₹{stats?.totalRevenue || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-info">
              <h3>Total Sales</h3>
              <p>{stats?.totalSells || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Active Listings</h3>
              <p>{stats?.activeListings || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>Average Rating</h3>
              <p>{stats?.averageRating || 0}</p>
            </div>
          </div>
        </div>

        {stats?.salesOverview && stats.salesOverview.length > 0 && (
          <div className="sales-overview">
            <h2>Sales Overview (Last 6 Months)</h2>
            <div className="sales-chart">
              {stats.salesOverview.map((item, index) => (
                <div key={index} className="sales-item">
                  <div className="sales-bar">
                    <div
                      className="sales-bar-fill"
                      style={{ height: `${(item.sales / Math.max(...stats.salesOverview.map(s => s.sales))) * 100}%` }}
                    />
                  </div>
                  <p>{item.month}</p>
                  <p className="sales-value">{item.sales} sales</p>
                  <p className="revenue-value">₹{item.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;

