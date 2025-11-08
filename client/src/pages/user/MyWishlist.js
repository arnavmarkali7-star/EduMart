import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './MyWishlist.css';

const MyWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('/api/wishlist');
      setWishlist(res.data.data);
    } catch (error) {
      toast.error('Error fetching wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`/api/wishlist/${id}`);
      toast.success('Removed from wishlist');
      fetchWishlist();
    } catch (error) {
      toast.error('Error removing from wishlist');
    }
  };

  if (loading) {
    return <div className="loading">Loading wishlist...</div>;
  }

  return (
    <div className="my-wishlist">
      <div className="container">
        <h1>My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="no-items">No items in wishlist</div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item._id} className="wishlist-item">
                <Link to={`/products/${item.product._id}`}>
                  <div className="item-image">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000/${item.product.images[0]}`}
                        alt={item.product.name}
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="item-info">
                    <h3>{item.product.name}</h3>
                    <p className="item-price">₹{item.product.price}</p>
                    <p className="item-category">{item.product.category}</p>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWishlist;

