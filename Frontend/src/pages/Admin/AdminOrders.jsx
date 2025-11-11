import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import AdminSidebar from '../../component/AdminSidebar';
import '../../style/Admin.css';

const AdminOrders = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user && !user.is_admin) {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, user, navigate]);

  if (loading) {
    return <div className="admin-container">Loading orders...</div>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="admin-main-content">
        <div className="admin-container">
          <h1>All Orders</h1>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="admin-orders-list">
              {orders.map((order) => (
                <div key={order.id} className="admin-order-card">
                  <h3>Order #{order.id}</h3>
                  <p>User ID: {order.user_id}</p>
                  <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                  <p>Status: {order.status}</p>
                  <p>Total: ${order.total_amount}</p>
                  <div className="admin-order-items">
                    {order.items.map((item) => (
                      <div key={item.id} className="admin-order-item">
                        <span>{item.product_name}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
