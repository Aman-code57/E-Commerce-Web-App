import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../redux/features/productslice';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import AdminSidebar from '../../component/AdminSidebar';
import '../../style/Admin.css';

const AdminProducts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { list: products, loading } = useSelector((state) => state.products);
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user && !user.is_admin) {
      navigate('/');
      return;
    }
    dispatch(fetchProducts());
  }, [token, user, dispatch, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', formData);
        toast.success('Product added successfully');
      }
      dispatch(fetchProducts());
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: '', image: '' });
    } catch (error) {
      toast.error('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        toast.success('Product deleted successfully');
        dispatch(fetchProducts());
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  if (loading) {
    return <div className="admin-container">Loading products...</div>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="admin-main-content">
        <div className="admin-container">
          <h1>Manage Products</h1>
          <button className="add-btn" onClick={() => setShowForm(true)}>Add New Product</button>

          {showForm && (
            <form onSubmit={handleSubmit} className="product-form">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
              <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required />
              <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required />
              <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleInputChange} />
              <button type="submit">{editingProduct ? 'Update' : 'Add'} Product</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); }}>Cancel</button>
            </form>
          )}

          <div className="admin-products-grid">
            {products.map((product) => (
              <div key={product.id} className="admin-product-card">
                {product.image && <img src={product.image} alt={product.name} className="product-image" />}
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">${product.price}</p>
                <p>Category: {product.category}</p>
                <div className="product-actions">
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
