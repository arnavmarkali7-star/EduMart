import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Products.css';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products/my-products');
      setProducts(res.data.data);
    } catch (error) {
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="seller-products">
      <div className="container">
        <h1>My Products</h1>

        <Link to="/sell-product" className="add-product-btn">
          Add New Product
        </Link>

        {products.length === 0 ? (
          <div className="no-products">
            <p>You haven't listed any products yet.</p>
            <Link to="/sell-product" className="add-product-btn" style={{ marginTop: '1rem', display: 'inline-block' }}>
              List Your First Product
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
            <div key={product._id} className="product-card">
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
                <p>Category: {product.category}</p>
                <p>Price: ₹{product.price}</p>
                <p>Status: {product.status}</p>
                <p>Available: {product.available ? 'Yes' : 'No'}</p>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;

