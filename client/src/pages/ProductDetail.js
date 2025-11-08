import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [rating, setRating] = useState({
    rating: 5,
    review: ''
  });
  const [showRatingForm, setShowRatingForm] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchRatings();
    checkWishlist();
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      const productData = res.data.data;
      console.log('Product data:', productData);
      console.log('Seller data:', productData?.seller);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`/api/ratings/product/${id}`);
      setRatings(res.data.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const checkWishlist = async () => {
    if (!user) return;
    try {
      const res = await axios.get('/api/wishlist');
      const wishlistItems = res.data.data;
      setInWishlist(wishlistItems.some(item => item.product._id === id));
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    try {
      if (inWishlist) {
        await axios.delete(`/api/wishlist/product/${id}`);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await axios.post('/api/wishlist', { productId: id });
        setInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Error updating wishlist');
    }
  };

  const handleCreateOrder = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post('/api/orders', {
        products: [{ product: id, price: product.price }],
        paymentMethod: 'cash'
      });
      toast.success('Order placed successfully!');
      navigate('/my-orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing order');
    }
  };

  const handleContactSeller = async (sellerId) => {
    if (!user) {
      toast.error('Please login to contact seller');
      navigate('/login');
      return;
    }

    try {
      console.log('Contacting seller with ID:', sellerId);
      const res = await axios.get(`/api/chat/user/${sellerId}`);
      console.log('Chat response:', res.data);
      const chat = res.data.data;
      if (chat && chat._id) {
        navigate('/my-chat', { state: { chatId: chat._id } });
        toast.success('Chat opened!');
      } else {
        toast.error('Error: Chat not created properly');
      }
    } catch (error) {
      console.error('Error opening chat:', error);
      toast.error(error.response?.data?.message || 'Error opening chat. Please try again.');
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to rate');
      return;
    }

    try {
      await axios.post('/api/ratings', {
        productId: id,
        rating: rating.rating,
        review: rating.review
      });
      toast.success('Rating submitted successfully');
      setShowRatingForm(false);
      fetchRatings();
    } catch (error) {
      toast.error('Error submitting rating');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0;

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-detail-layout">
          <div className="product-images">
            {product.images && product.images.length > 0 ? (
              <img
                src={`http://localhost:5000/${product.images[0]}`}
                alt={product.name}
              />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>

          <div className="product-details">
            <h1>{product.name}</h1>
            <p className="product-category">{product.category}</p>
            <p className="product-price">₹{product.price}</p>
            {product.originalPrice && (
              <p className="product-original-price">
                Original Price: ₹{product.originalPrice}
              </p>
            )}
            <p className="product-condition">Condition: {product.condition}</p>
            <div className="product-rating">
              <span>Rating: {averageRating} ⭐</span>
              <span>({ratings.length} reviews)</span>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.seller && (
              <div className="product-seller">
                <h3>Seller Information</h3>
                <div className="seller-info-grid">
                  <div className="seller-info-item">
                    <span className="seller-label">Name:</span>
                    <span className="seller-value">{product.seller.name || 'N/A'}</span>
                  </div>
                  {product.seller.email && (
                    <div className="seller-info-item">
                      <span className="seller-label">Email:</span>
                      <span className="seller-value">{product.seller.email}</span>
                    </div>
                  )}
                  {product.seller.college && 
                   product.seller.college.trim() && 
                   !product.seller.college.includes('@') && (
                    <div className="seller-info-item">
                      <span className="seller-label">College:</span>
                      <span className="seller-value">{product.seller.college}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="product-actions">
              {/* Contact Seller Button - Always show if seller exists and user is not the seller */}
              {product.seller && (() => {
                // Get seller ID (handle both object and string)
                const sellerId = typeof product.seller === 'string' 
                  ? product.seller 
                  : (product.seller._id || product.seller.id || product.seller);
                
                // Get current user ID
                const currentUserId = user?._id || user?.id;
                
                // Check if user is viewing their own product
                const isOwnProduct = sellerId && currentUserId && 
                  sellerId.toString() === currentUserId.toString();
                
                // Don't show button if user is viewing their own product
                if (isOwnProduct) {
                  return null;
                }
                
                // Show button for all other cases
                return (
                  <button
                    onClick={() => {
                      if (!user) {
                        toast.info('Please login to contact seller');
                        navigate('/login');
                      } else if (sellerId) {
                        handleContactSeller(sellerId);
                      } else {
                        toast.error('Seller information not available');
                      }
                    }}
                    className="contact-seller-btn"
                  >
                    💬 Contact Seller
                  </button>
                );
              })()}
              <button
                onClick={handleAddToWishlist}
                className={inWishlist ? 'wishlist-btn active' : 'wishlist-btn'}
              >
                {inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
              </button>
              <button
                onClick={handleCreateOrder}
                className="buy-btn"
                disabled={!product.available || product.status === 'sold'}
              >
                {product.available && product.status !== 'sold'
                  ? 'Place Order'
                  : 'Not Available'}
              </button>
            </div>
          </div>
        </div>

        <div className="product-reviews">
          <h2>Ratings & Reviews</h2>
          
          {user && (
            <button
              onClick={() => setShowRatingForm(!showRatingForm)}
              className="add-rating-btn"
            >
              {showRatingForm ? 'Cancel' : 'Add Rating'}
            </button>
          )}

          {showRatingForm && (
            <form onSubmit={handleSubmitRating} className="rating-form">
              <div className="form-group">
                <label>Rating</label>
                <select
                  value={rating.rating}
                  onChange={(e) =>
                    setRating({ ...rating, rating: Number(e.target.value) })
                  }
                >
                  <option value={5}>5 ⭐</option>
                  <option value={4}>4 ⭐</option>
                  <option value={3}>3 ⭐</option>
                  <option value={2}>2 ⭐</option>
                  <option value={1}>1 ⭐</option>
                </select>
              </div>
              <div className="form-group">
                <label>Review</label>
                <textarea
                  value={rating.review}
                  onChange={(e) =>
                    setRating({ ...rating, review: e.target.value })
                  }
                  placeholder="Write your review..."
                  rows="4"
                />
              </div>
              <button type="submit" className="submit-rating-btn">
                Submit Rating
              </button>
            </form>
          )}

          <div className="reviews-list">
            {ratings.length === 0 ? (
              <p>No ratings yet</p>
            ) : (
              ratings.map((rating) => (
                <div key={rating._id} className="review-item">
                  <div className="review-header">
                    <span className="reviewer-name">
                      {rating.user?.name || 'Anonymous'}
                    </span>
                    <span className="review-rating">
                      {rating.rating} ⭐
                    </span>
                  </div>
                  {rating.review && (
                    <p className="review-text">{rating.review}</p>
                  )}
                  <p className="review-date">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

