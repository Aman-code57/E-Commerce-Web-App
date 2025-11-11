import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory } from '../redux/features/productslice';
import { logout } from '../redux/features/Userslice';
import '../style/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const selectedCategory = useSelector((state) => state.products.selectedCategory);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    { value: '', label: 'All Categories', icon: '🛍️' },
    { value: ' fashion,', label: 'Fashion', icon: '👕' },
    { value: 'Electronics', label: 'Electronics', icon: '🔌📱💻' },
    { value: 'homegoods', label: 'Home Goods', icon: '🏠🪑🛌' },
    { value: 'health and beauty', label: 'health and beauty', icon: '🏥💅💄' },
    { value: 'Accessories', label: 'Accessories', icon: '🔌' },
  ];

  const handleCategoryChange = (categoryValue) => {
    dispatch(setSelectedCategory(categoryValue));
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toggleSidebar();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <div className="category-list" ref={dropdownRef}>
            <div className="custom-dropdown">
              <div className="dropdown-header" onClick={toggleDropdown}>
                <span className="dropdown-icon">
                  {categories.find(cat => cat.value === selectedCategory)?.icon || '🛍️'}
                </span>
                <span className="dropdown-text">
                  {categories.find(cat => cat.value === selectedCategory)?.label || 'All Categories'}
                </span>
                <motion.span
                  className="dropdown-arrow"
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ▼
                </motion.span>
              </div>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="dropdown-options"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {categories.map((category) => (
                      <div
                        key={category.value}
                        className={`dropdown-option ${selectedCategory === category.value ? 'selected' : ''}`}
                        onClick={() => handleCategoryChange(category.value)}
                      >
                        <span className="option-icon">{category.icon}</span>
                        <span className="option-text">{category.label}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          {token && (
            <Link to="/profile" className="sidebar-link">
              <span className="icon">👤</span> Profile
            </Link>
          )}
          <Link to="/settings" className="sidebar-link">
            <span className="icon">⚙️</span> Settings
          </Link>
        </div>

        {token && (
          <div className="sidebar-section">
            <button className="logout-btn" onClick={handleLogout}>
              <span className="icon">🚪</span> Logout
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Sidebar;
