import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './SellProduct.css';

const SellProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Books',
    price: '',
    originalPrice: '',
    condition: 'Good',
    location: '',
    images: null
  });

  const handleChange = (e) => {
    if (e.target.name === 'images') {
      setFormData({
        ...formData,
        images: e.target.files
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('originalPrice', formData.originalPrice);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('location', formData.location);

      if (formData.images) {
        Array.from(formData.images).forEach((image) => {
          formDataToSend.append('images', image);
        });
      }

      const res = await axios.post('/api/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Product created successfully!');
      navigate('/seller/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sell-product">
      <div className="container">
        <h1>Sell Your Product</h1>

        <form onSubmit={handleSubmit} className="sell-product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your product..."
              rows="5"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="Enter price"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Original Price (₹)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="Enter original price"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Images (Max 5 images)</label>
            <input
              type="file"
              name="images"
              onChange={handleChange}
              accept="image/*"
              multiple
              max={5}
            />
            <small>You can upload up to 5 images (Max 5MB each)</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating Product...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellProduct;
