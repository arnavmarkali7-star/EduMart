import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Complaints.css';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/api/admin/complaints');
      setComplaints(res.data.data);
    } catch (error) {
      toast.error('Error fetching complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (complaintId, status) => {
    try {
      await axios.put(`/api/complaints/${complaintId}/status`, {
        status,
        adminResponse: adminResponse || undefined
      });
      toast.success('Complaint status updated');
      setSelectedComplaint(null);
      setAdminResponse('');
      fetchComplaints();
    } catch (error) {
      toast.error('Error updating complaint');
    }
  };

  if (loading) {
    return <div className="loading">Loading complaints...</div>;
  }

  return (
    <div className="admin-complaints">
      <div className="container">
        <h1>Complaints Management</h1>

        <div className="complaints-list">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="complaint-card">
              <div className="complaint-header">
                <div>
                  <h3>{complaint.subject}</h3>
                  <p>Type: {complaint.type} | Priority: {complaint.priority}</p>
                  <p>User: {complaint.user?.name || 'N/A'}</p>
                </div>
                <span className={`status status-${complaint.status}`}>
                  {complaint.status}
                </span>
              </div>
              <p className="complaint-description">{complaint.description}</p>
              {complaint.adminResponse && (
                <div className="admin-response">
                  <strong>Admin Response:</strong>
                  <p>{complaint.adminResponse}</p>
                </div>
              )}
              <div className="complaint-actions">
                <select
                  onChange={(e) => {
                    setSelectedComplaint(complaint._id);
                    handleUpdateStatus(complaint._id, e.target.value);
                  }}
                  value={complaint.status}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminComplaints;

