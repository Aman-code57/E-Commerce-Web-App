import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FaShoppingCart, FaRupeeSign, FaBox, FaChartLine, FaUsers, FaClock, FaStar } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import AdminSidebar from '../../component/AdminSidebar';
import '../../style/Admin.css';
import Footer from '../../component/Footer';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
  }, [token, user, navigate]);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const analyticsRes = await api.get('/analytics');
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token, user, navigate]);

  if (loading) {
    return <div className="admin-container">Loading dashboard...</div>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="admin-main-content">
        <div className="admin-dashboard">
          <h1>Dashboard</h1>

          {/* Analytics Section */}
          <section className="analytics-section">
            <h2>Analytics Overview</h2>
            {analytics && (
              <motion.div
                className="analytics-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="analytics-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaShoppingCart className="card-icon" />
                  <h3>Total Orders</h3>
                  <p className="metric">{analytics.total_orders}</p>
                </motion.div>
                <motion.div
                  className="analytics-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaRupeeSign className="card-icon" />
                  <h3>Total Revenue</h3>
                  <p className="metric">₹{analytics.total_revenue}</p>
                </motion.div>
                <motion.div
                  className="analytics-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaBox className="card-icon" />
                  <h3>Total Products</h3>
                  <p className="metric">{analytics.total_products}</p>
                </motion.div>
                <motion.div
                  className="analytics-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaUsers className="card-icon" />
                  <h3>Total Users</h3>
                  <p className="metric">{analytics.total_users}</p>
                </motion.div>
              </motion.div>
            )}

            {/* Charts Section */}
            {analytics && analytics.order_status_counts && (
              <motion.div
                className="charts-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="chart-container">
                  <h3>Order Status Distribution📈📉</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(analytics.order_status_counts).map(([status, count]) => ({ status, count }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#007bff" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-container">
                  <h3>Order Status Pie Chart ◔</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(analytics.order_status_counts).map(([status, count]) => ({ name: status, value: count }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(analytics.order_status_counts).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Revenue Trends Chart */}
            {analytics && analytics.revenue_trends && (
              <motion.div
                className="charts-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="chart-container">
                  <h3>Revenue Trends (Last 12 Months)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.revenue_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#28a745" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </section>

          {/* Recent Orders and Top Products Section */}
          <motion.section
            className="recent-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="recent-grid">
              {/* Recent Orders */}
              <div className="recent-orders">
                <h2>Recent Orders📦</h2>
                {analytics && analytics.recent_orders && analytics.recent_orders.length > 0 ? (
                  <div className="orders-list">
                    {analytics.recent_orders.map((order) => (
                      <motion.div
                        key={order.id}
                        className="order-item"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="order-info">
                          <p><strong>Order #{order.id}</strong> by {order.user}</p>
                          <p>₹{order.total_amount} - {order.status}</p>
                          <p className="order-date">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p>No recent orders</p>
                )}
              </div>

              {/* Top Products */}
              <div className="top-products">
                <h2>Top Selling Products🔥</h2>
                {analytics && analytics.top_products && analytics.top_products.length > 0 ? (
                  <div className="products-list">
                    {analytics.top_products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        className="product-item"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="product-rank">
                          <FaStar className="star-icon" />
                          <span>{index + 1}</span>
                        </div>
                        <div className="product-info">
                          <p><strong>{product.name}</strong></p>
                          <p>Sold: {product.total_sold}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p>No top products data</p>
                )}
              </div>
            </div>
          </motion.section>

          {/* Quick Actions Section */}
          <motion.section
            className="quick-actions-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              <motion.button
                className="quick-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/products')}
              >
                <FaBox />
                Manage Products
              </motion.button>
              <motion.button
                className="quick-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/orders')}
              >
                <FaShoppingCart />
                Manage Orders
              </motion.button>
              <motion.button
                className="quick-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/analytics')}
              >
                <FaChartLine />
                View Analytics
              </motion.button>
            </div>
          </motion.section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
