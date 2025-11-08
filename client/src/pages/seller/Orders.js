import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Orders.css';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/seller/orders');
      setOrders(res.data.data);
    } catch (error) {
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="seller-orders">
      <div className="container">
        <h1>My Orders</h1>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <p>Buyer: {order.buyer?.name || 'N/A'}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="order-products">
                {order.products.map((item, index) => (
                  <div key={index} className="order-product">
                    <h4>{item.product?.name || 'Product'}</h4>
                    <p>Quantity: {item.quantity} | Price: ₹{item.price}</p>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <strong>Total: ₹{order.totalAmount}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;

