import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import AdminSidebar from '../../component/AdminSidebar';
import '../../style/Admin.css';
import Footer from '../../component/Footer';

const AdminUsers = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user && !user.is_admin) {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, user, navigate]);

  if (loading) {
    return <div className="admin-container">Loading users...</div>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="admin-main-content">
        <div className="admin-container">
          <h1>All Users</h1>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="admin-users-list">
              {users.map((user) => (
                <div key={user.id} className="admin-user-card">
                  <h3>{user.name}</h3>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phoneno || 'N/A'}</p>
                  <p>Address: {user.address || 'N/A'}</p>
                  <p>Gender: {user.gender || 'N/A'}</p>
                  <p>Admin: {user.is_admin ? 'Yes' : 'No'}</p>
                  <p>Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminUsers;
