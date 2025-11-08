import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/admin/products');
      setProducts(res.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="admin-products">
      <div className="container">
        <h1>Products Management</h1>

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
                <p>Seller: {product.seller?.name || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;

