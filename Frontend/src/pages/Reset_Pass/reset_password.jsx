import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { ResetPassword as resetPasswordAction } from '../../redux/features/Userslice';
import { TbLockPassword } from "react-icons/tb";
import "../../style/reset_password.css"

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!password.trim()) {
      setPasswordError('Password is required');
      passwordRef.current.focus();
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm password is required');
      if (!hasError) confirmPasswordRef.current.focus();
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      if (!hasError) confirmPasswordRef.current.focus();
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    if (hasError) return;

    const resultAction = await dispatch(resetPasswordAction({ password }));
    if (resetPasswordAction.fulfilled.match(resultAction)) {
      navigate('/login');
    }
  };

  return (
    <motion.div
      className="resetpass-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="resetpass-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="resetpass-title">Reset Password🔒</h2>

        <form onSubmit={handleSubmit} className="resetpass-form">
          <motion.div
            className="resetpass-group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label>New Password <span style={{ color: 'red' }}>*</span></label>
            <div className="inputsss-with-iconsss">
              <TbLockPassword />
              <input
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => { if (!password.trim()) setPasswordError('Password is required'); else setPasswordError(''); }}
                ref={passwordRef}
              />
            </div>
            {passwordError && <span className="error">{passwordError}</span>}
          </motion.div>

          <motion.div
            className="resetpass-group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label>Confirm Password <span style={{ color: 'red' }}>*</span></label>
            <div className="inputsss-with-iconsss">
              <TbLockPassword />
              <input
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => {
                  if (!confirmPassword.trim()) {
                    setConfirmPasswordError('Confirm password is required');
                  } else if (password !== confirmPassword) {
                    setConfirmPasswordError('Passwords do not match');
                  } else {
                    setConfirmPasswordError('');
                  }
                }}
                ref={confirmPasswordRef}
              />
            </div>
            {confirmPasswordError && <span className="error">{confirmPasswordError}</span>}
          </motion.div>

          <motion.button
            type="submit"
            className="resetpass-btn"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <TbLockPassword /> {loading ? 'Resetting Password...' : 'Reset Password'}
          </motion.button>

          <div className="resetpass-footer">
            <Link to="/login"><FaArrowLeft /> Back to Login</Link>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;
