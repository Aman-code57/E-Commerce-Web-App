import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/features/Userslice';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    phoneno: '',
    pincode: '',
    locality: '',
    city: '',
    state: ''
  });

  // When user data is loaded, split address into parts
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user) {
      const [locality = '', city = '', state = '', pincode = ''] = (user.address || '').split(',').map(s => s.trim());
      setFormData({
        name: user.name || '',
        phoneno: user.phoneno || '',
        locality,
        city,
        state,
        pincode
      });
    }
  }, [user, token, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine parts into a single address string
    const fullAddress = `${formData.city},${formData.locality},${formData.state}, ${formData.pincode}`.trim();

    const updatedData = {
      name: formData.name,
      phoneno: formData.phoneno,
      address: fullAddress
    };

    dispatch(updateUser(updatedData));
  };

  if (!token) return null;

  return (
    <div className="profiles-containers">
      <div className="profiles-cards">
        <h2>User Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="formss-groupss">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formss-groupss">
            <label htmlFor="phoneno">Mobile Number</label>
            <input
              type="tel"
              id="phoneno"
              name="phoneno"
              value={formData.phoneno}
              onChange={handleChange}
            />
          </div>

          <div className="formss-groupss">
            <label htmlFor="locality">District</label>
            <input
              type="text"
              id="locality"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
            />
          </div>

          <div className="formss-groupss">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="formss-groupss">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="formss-groupss">
            <label htmlFor="pincode">Pincode</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
