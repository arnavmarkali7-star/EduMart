import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products?limit=6');
      setProducts(res.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to EduMart</h1>
          <p>Buy and Sell Second Hand Products with College Students</p>
          <Link to="/products" className="cta-button">
            Browse Products
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose EduMart?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛍️</div>
              <h3>Easy Buying & Selling</h3>
              <p>Simple platform for college students to exchange products</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Ratings & Reviews</h3>
              <p>Rate products and sellers for better experience</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Real-time Chat</h3>
              <p>Chat with sellers and buyers directly</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Safe</h3>
              <p>Secure transactions and user verification</p>
            </div>
          </div>
        </div>
      </section>

      <section className="recent-products">
        <div className="container">
          <h2>Recent Products</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="product-card"
                >
                  <div className="product-image">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000/${product.images[0]}`}
                        alt={product.name}
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">₹{product.price}</p>
                    <p className="product-condition">Condition: {product.condition}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/products" className="view-all-button">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

