import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { loginUser } from '../../redux/features/Userslice';
import Footer from '../../component/Footer';
import '../../style/Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let firstErrorField = null;
    if (!email.trim()) {
      setEmailError('Email is required');
      if (!firstErrorField) firstErrorField = emailRef;
    } else {
      setEmailError('');
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
      if (!firstErrorField) firstErrorField = passwordRef;
    } else {
      setPasswordError('');
    }
    if (firstErrorField) {
      setTimeout(() => firstErrorField.current.focus(), 0);
      return;
    }

    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="login-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="login-title">Welcome Back👋</h2>
        <p className="login-subtitle">Login🔐to continue shopping🛒</p>

        <form onSubmit={handleSubmit} className="login-form">
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label>Email Address <span style={{ color: 'red' }}>*</span></label>
            <div className="input-with-icon">
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

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label>Password <span style={{ color: 'red' }}>*</span></label>
            <div className="input-with-icon">
              <FaLock />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => { if (!password.trim()) setPasswordError('Password is required'); else setPasswordError(''); }}
                ref={passwordRef}
              />
            </div>
            {passwordError && <span className="error">{passwordError}</span>}
          </motion.div>

          <motion.button
            type="submit"
            className="login-btn"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <FaSignInAlt /> {loading ? 'Logging in...' : 'Login'}
          </motion.button>

          <div className="login-footer">
            <Link to="/forgot-password">Forgot Password?</Link>
            <p>
              Don’t have an account? <a href="/register">Register</a>
            </p>
          </div>
        </form>
      </motion.div>

    </motion.div>
  );
};

export default Login;
