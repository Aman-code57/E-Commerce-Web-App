import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/features/Userslice';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../style/Admin.css';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/orders', label: 'Orders', icon: '📦' },
    { path: '/admin/products', label: 'Products', icon: '🛍️' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
  ];

  return (
    <>
      {/* Admin Header */}
      <header className="admin-header">
        <div className="hamburger" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="logo">
          <Link to="/admin"><img src={logo} alt="ShopWay Logo" />EComMarket</Link>
        </div>
        <nav className="admin-nav">
          <Link to="/admin">Admin Panel</Link>
        </nav>
      </header>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p>Welcome, {user?.username || 'Aman'}</p>
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={toggleSidebar}
            >
              <span className="admin-sidebar-icon">{item.icon}</span>
              <span className="admin-sidebar-text">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span className="admin-sidebar-icon">🚪</span>
            <span className="admin-sidebar-text">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
