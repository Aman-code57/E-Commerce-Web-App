import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaPhone, FaMapMarker, FaVenusMars } from 'react-icons/fa';
import { registerUser } from '../../redux/features/Userslice';
import Footer from '../../component/Footer';
import '../../style/Register.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [mobileno, setMobileno] = useState('');
  const [address, setAddress] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [mobilenoError, setMobilenoError] = useState('');
  const [addressError, setAddressError] = useState('');
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const genderRef = useRef(null);
  const mobilenoRef = useRef(null);
  const addressRef = useRef(null);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let firstErrorField = null;
    if (!name.trim()) {
      setNameError('Name is required');
      if (!firstErrorField) firstErrorField = nameRef;
    } else {
      setNameError('');
    }
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
    if (!gender.trim()) {
      setGenderError('Gender is required');
      if (!firstErrorField) firstErrorField = genderRef;
    } else {
      setGenderError('');
    }
    if (!mobileno.trim()) {
      setMobilenoError('Mobile number is required');
      if (!firstErrorField) firstErrorField = mobilenoRef;
    } else {
      setMobilenoError('');
    }
    if (!address.trim()) {
      setAddressError('Address is required');
      if (!firstErrorField) firstErrorField = addressRef;
    } else {
      setAddressError('');
    }
    if (firstErrorField) {
      setTimeout(() => firstErrorField.current.focus(), 0);
      return;
    }

    const userData = {
      name,
      email,
      password,
      phoneno: mobileno,
      address,
      gender,
    };

    const resultAction = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/login');
    }
  };

  return (
    <motion.div
      className="register-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="register-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="register-title">Create Account✍️</h2>
        <p className="register-subtitle">Join us to start shopping🛒</p>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label>Full Name <span style={{ color: 'red' }}>*</span></label>
              <div className="input-with-icon">
                <FaUser />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => { if (!name.trim()) setNameError('Name is required'); else setNameError(''); }}
                  ref={nameRef}
                />
              </div>
              {nameError && <span className="error">{nameError}</span>}
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
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
          </div>

          <div className="form-row">
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label>Password <span style={{ color: 'red' }}>*</span></label>
              <div className="input-with-icon">
                <FaLock />
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => { if (!password.trim()) setPasswordError('Password is required'); else setPasswordError(''); }}
                  ref={passwordRef}
                />
              </div>
              {passwordError && <span className="error">{passwordError}</span>}
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label>Gender <span style={{ color: 'red' }}>*</span></label>
              <div className="input-with-icon">
                <FaVenusMars />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  onBlur={() => { if (!gender.trim()) setGenderError('Gender is required'); else setGenderError(''); }}
                  ref={genderRef}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {genderError && <span className="error">{genderError}</span>}
            </motion.div>
          </div>

          <div className="form-row">
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <label>Mobile No <span style={{ color: 'red' }}>*</span></label>
              <div className="input-with-icon">
                <FaPhone />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobileno}
                  onChange={(e) => setMobileno(e.target.value)}
                  onBlur={() => { if (!mobileno.trim()) setMobilenoError('Mobile number is required'); else setMobilenoError(''); }}
                  ref={mobilenoRef}
                />
              </div>
              {mobilenoError && <span className="error">{mobilenoError}</span>}
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <label>Address <span style={{ color: 'red' }}>*</span></label>
              <div className="input-with-icon">
                <FaMapMarker />
                <input
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() => { if (!address.trim()) setAddressError('Address is required'); else setAddressError(''); }}
                  ref={addressRef}
                />
              </div>
              {addressError && <span className="error">{addressError}</span>}
            </motion.div>
          </div>

          <motion.button
            type="submit"
            className="register-btn"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <FaUserPlus /> {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>

          <div className="register-footer">
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Register;
