import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);

      const res = await axios.get(`/api/products?${params.toString()}`);
      setProducts(res.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1>Browse Products</h1>

        <div className="products-layout">
          <div className="filters-sidebar">
            <h3>Filters</h3>

            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
              />
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Condition</label>
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
              >
                <option value="">All Conditions</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Min Price (₹)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
              />
            </div>

            <div className="filter-group">
              <label>Max Price (₹)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
              />
            </div>

            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>

          <div className="products-content">
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="no-products">No products found</div>
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
                      {product.seller && (
                        <p className="product-seller">
                          Seller: {product.seller.name}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

