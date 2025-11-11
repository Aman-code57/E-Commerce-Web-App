import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaHome, FaShoppingCart, FaSignInAlt, FaUserPlus, FaHistory } from 'react-icons/fa';
import Sidebar from './Sidebar';
import logo from '../assets/logo.png';
import '../style/Header.css';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.user.token);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && (
        <>
          <header className="header">
            <div className="hamburger" onClick={toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="logo">
              <Link to="/"><img src={logo} alt="ShopWay Logo" />EComMart</Link>
            </div>
            <nav>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link to="/">
                  <FaHome /> Home
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link to="/cart">
                  <FaShoppingCart /> Cart ({cartItems.length})
                </Link>
              </motion.div>
              {token ? (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/orders">
                    <FaHistory /> Order History
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login">
                      <FaSignInAlt /> Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register">
                      <FaUserPlus /> Register
                    </Link>
                  </motion.div>
                </>
              )}
            </nav>
          </header>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      )}
    </>
  );
};

export default Header;
