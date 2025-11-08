import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data.data);
    } catch (error) {
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa500',
      confirmed: '#2196F3',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#f44336'
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="my-orders">
      <div className="container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders">No orders found</div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span
                    className="order-status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="order-products">
                  {order.products.map((item, index) => (
                    <div key={index} className="order-product">
                      <div>
                        <h4>{item.product?.name || 'Product'}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ₹{order.totalAmount}</strong>
                  </div>
                  <div className="order-seller">
                    <p>
                      {order.buyer?._id === order.seller?._id
                        ? 'You'
                        : order.seller?.name || 'Seller'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

