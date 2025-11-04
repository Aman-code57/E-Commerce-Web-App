import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cartslice';
import '../../style/Home.css';

const Home = () => {
  const { list: allProducts, selectedCategory } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const filteredProducts = selectedCategory
    ? allProducts.filter(product => product.category === selectedCategory)
    : allProducts;

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="home">
      <h1>Welcome to Our E-Commerce Store</h1>
      <div className="products">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>Price: ₹{product.price}</p>
            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
