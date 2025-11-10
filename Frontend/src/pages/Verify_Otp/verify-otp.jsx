import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { MdOutlineVerified } from "react-icons/md";
import { VerifyOTP as verifyOTPAction, forgotPassword } from '../../redux/features/Userslice';
import { getCookie } from '../../utils/cookies';
import '../../style/verifyotp.css';

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const VerifyOTP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  const [OTP, setOTP] = useState('');
  const [OTPError, setOTPError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const OTPRef = useRef(null);

  useEffect(() => {
    if (OTPRef.current) {
      OTPRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (timeLeft === 0) {
      // If timer expired, treat as resend
      handleResendOTP();
      return;
    }
    if (!OTP.trim()) {
      setOTPError('OTP is required');
      OTPRef.current.focus();
      return;
    } else if (OTP.length !== 6) {
      setOTPError('OTP must be exactly 6 digits');
      OTPRef.current.focus();
      return;
    } else {
      setOTPError('');
    }

    const resultAction = await dispatch(verifyOTPAction({ OTP }));
    if (verifyOTPAction.fulfilled.match(resultAction)) {
      navigate('/reset-password');
    }
  };

  const handleResendOTP = async () => {
    const email = getCookie("reset_email");
    if (!email) {
      setOTPError('No email found. Please restart the process.');
      return;
    }
    const resultAction = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(resultAction)) {
      setTimeLeft(60);
      setOTP('');
      setOTPError('');
    }
  };

  return (
    <motion.div
      className="verify-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="verify-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="verify-title">OTP Verification🔑</h2>
        <p className="verify-subtitle">Verify OTP for Reset Password</p>
        <p className="timer">Time remaining: {formatTime(timeLeft)}</p>
        {timeLeft === 0 && <p className="errorss">OTP expired. Please request a new one.</p>}

        <form onSubmit={handleSubmit} className="Verify-form">
          <motion.div
            className="verify-group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label>OTP <span style={{ color: 'red' }}>*</span></label>
            <div className="inputss-with-iconss">
              <MdOutlineVerified />
              <input
                type="text"
                placeholder="Enter OTP🔑"
                value={OTP}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Allow only digits
                  if (value.length <= 6) {
                    setOTP(value);
                  }
                }}
                onBlur={() => { if (!OTP.trim()) setOTPError('OTP is required'); else setOTPError(''); }}
                ref={OTPRef}
              />
            </div>
            {OTPError && <span className="errors">{OTPError}</span>}
          </motion.div>

          <motion.button
            type="submit"
            className="verify-btn"
            disabled={loading || timeLeft === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <MdOutlineVerified /> {loading ? 'Verifying...' : timeLeft === 0 ? 'Resend OTP' : 'Verify OTP'}
          </motion.button>

          <div className="verify-footer">
            <Link to="/login"><FaArrowLeft /> Back to Login</Link>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default VerifyOTP;
