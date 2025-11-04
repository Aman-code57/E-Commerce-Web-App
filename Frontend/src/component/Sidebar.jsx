import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory } from '../redux/features/productslice';
import '../style/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const selectedCategory = useSelector((state) => state.products.selectedCategory);
  const dispatch = useDispatch();

  const categories = ['clothes', 'electronics', 'laptop', 'mobiles', 'mobileAccessories'];

  const handleCategoryChange = (e) => {
    dispatch(setSelectedCategory(e.target.value));
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <motion.div
        className="sidebar"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={toggleSidebar}>×</button>
        </div>

        <div className="sidebar-section">
          <h3>Categories</h3>
          <div className="category-list">
            <select value={selectedCategory} onChange={handleCategoryChange} className="category-dropdown">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sidebar-section">
          <Link to="/profile" className="sidebar-link">
            <span className="icon">👤</span> Profile
          </Link>
          <Link to="/settings" className="sidebar-link">
            <span className="icon">⚙️</span> Settings
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
