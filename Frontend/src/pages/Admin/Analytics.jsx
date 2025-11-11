import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import '../../style/Admin.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user && !user.is_admin) {
      navigate('/');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token, user, navigate]);

  if (loading) {
    return <div className="admin-container">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="admin-container">No analytics data available.</div>;
  }

  return (
    <div className="admin-container">
      <h1>Analytics Dashboard</h1>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Orders</h3>
          <p className="metric">{analytics.total_orders}</p>
        </div>
        <div className="analytics-card">
          <h3>Total Revenue</h3>
          <p className="metric">${analytics.total_revenue}</p>
        </div>
        <div className="analytics-card">
          <h3>Total Products</h3>
          <p className="metric">{analytics.total_products}</p>
        </div>
      </div>

      <div className="order-status-chart">
        <h3>Order Status Distribution</h3>
        <div className="status-list">
          {Object.entries(analytics.order_status_counts).map(([status, count]) => (
            <div key={status} className="status-item">
              <span>{status}: {count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
