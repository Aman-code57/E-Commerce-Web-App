import React from 'react';
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaTwitter } from 'react-icons/fa';
import '../style/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>Email: ecommart@gmail.com</p>
            <p>contact: +91-9876543256</p>
          </div>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
        <div className="footer-right">
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaInstagram />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTelegramPlane />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 E-Commerce Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
