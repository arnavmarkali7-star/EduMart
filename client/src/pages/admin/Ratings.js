import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Ratings.css';

const AdminRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const res = await axios.get('/api/admin/ratings');
      setRatings(res.data.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading ratings...</div>;
  }

  return (
    <div className="admin-ratings">
      <div className="container">
        <h1>Ratings & Feedback</h1>

        <div className="ratings-list">
          {ratings.map((rating) => (
            <div key={rating._id} className="rating-card">
              <div className="rating-header">
                <div>
                  <h3>{rating.user?.name || 'Anonymous'}</h3>
                  <p>Product: {rating.product?.name || 'N/A'}</p>
                </div>
                <span className="rating-stars">
                  {rating.rating} ⭐
                </span>
              </div>
              {rating.review && (
                <p className="rating-review">{rating.review}</p>
              )}
              <p className="rating-date">
                {new Date(rating.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminRatings;

