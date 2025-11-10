import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './redux/store';
import Header from './component/Header';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Register from './pages/Register/register';
import ForgotPassword from './pages/Forgot_pass/forgot_password';
import VerifyOTP from './pages/Verify_Otp/verify-otp';
import ResetPassword from './pages/Reset_Pass/reset_password';
import Cart from './pages/Cart/cart';
import './style/general.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
