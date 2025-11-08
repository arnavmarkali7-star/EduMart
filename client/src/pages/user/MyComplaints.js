import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './MyComplaints.css';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'product',
    subject: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/api/complaints/my-complaints');
      setComplaints(res.data.data);
    } catch (error) {
      toast.error('Error fetching complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/complaints', formData);
      toast.success('Complaint submitted successfully');
      setShowForm(false);
      setFormData({
        type: 'product',
        subject: '',
        description: '',
        priority: 'medium'
      });
      fetchComplaints();
    } catch (error) {
      toast.error('Error submitting complaint');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa500',
      'in-progress': '#2196F3',
      resolved: '#4CAF50',
      rejected: '#f44336'
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return <div className="loading">Loading complaints...</div>;
  }

  return (
    <div className="my-complaints">
      <div className="container">
        <div className="complaints-header">
          <h1>My Complaints</h1>
          <button onClick={() => setShowForm(!showForm)} className="new-complaint-btn">
            {showForm ? 'Cancel' : 'New Complaint'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="product">Product</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
                <option value="platform">Platform</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Enter complaint subject"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your complaint..."
                rows="5"
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">Submit Complaint</button>
          </form>
        )}

        {complaints.length === 0 ? (
          <div className="no-complaints">No complaints submitted</div>
        ) : (
          <div className="complaints-list">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="complaint-card">
                <div className="complaint-header">
                  <div>
                    <h3>{complaint.subject}</h3>
                    <p>Type: {complaint.type} | Priority: {complaint.priority}</p>
                  </div>
                  <span
                    className="complaint-status"
                    style={{ color: getStatusColor(complaint.status) }}
                  >
                    {complaint.status.toUpperCase()}
                  </span>
                </div>
                <p className="complaint-description">{complaint.description}</p>
                {complaint.adminResponse && (
                  <div className="admin-response">
                    <strong>Admin Response:</strong>
                    <p>{complaint.adminResponse}</p>
                  </div>
                )}
                <p className="complaint-date">
                  Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;

