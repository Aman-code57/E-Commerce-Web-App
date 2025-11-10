import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { forgotPassword } from '../../redux/features/Userslice';
import '../../style/forgotpass.css';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const emailRef = useRef(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Email is required');
      emailRef.current.focus();
      return;
    } else {
      setEmailError('');
    }

    const resultAction = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(resultAction)) {
      navigate('/verify-otp');
    }
  };

  return (
    <motion.div
      className="forgot-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="forgot-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="forgot-title">Forgot Password?🔒</h2>
        <p className="forgot-subtitle">Enter your email to reset your password</p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <motion.div
            className="forgot-group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label>Email Address <span style={{ color: 'red' }}>*</span></label>
            <div className="inputs-with-icons">
              <FaEnvelope />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => { if (!email.trim()) setEmailError('Email is required'); else setEmailError(''); }}
                ref={emailRef}
              />
            </div>
            {emailError && <span className="error">{emailError}</span>}
          </motion.div>

          <motion.button
            type="submit"
            className="forgot-btn"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FaEnvelope /> {loading ? 'Sending...' : 'Send OTP'}
          </motion.button>

          <div className="forgot-footer">
            <Link to="/login"><FaArrowLeft /> Back to Login</Link>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
