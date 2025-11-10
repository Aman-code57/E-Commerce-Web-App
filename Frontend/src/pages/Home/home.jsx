import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, increaseQuantity, decreaseQuantity } from '../../redux/features/cartslice';
import Footer from '../../component/Footer';
import '../../style/Home.css';

const Home = () => {
  const { list: allProducts, selectedCategory } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [showProducts, setShowProducts] = useState(false);

  const filteredProducts = selectedCategory
    ? allProducts.filter(product => product.category === selectedCategory)
    : allProducts;

  const featuredProducts = allProducts.slice(0, 4); // Show first 4 products as featured

  const getCartItem = (productId) => {
    return cartItems.find(item => item.id === productId);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleStartShopping = () => {
    setShowProducts(true);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Premium E-Commerce Store</h1>
          <p>Discover the best products at unbeatable prices. Shop with confidence and enjoy fast, secure delivery.</p>
          <button className="cta-btn" onClick={handleStartShopping}>
            Start Shopping Now
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => {
            const cartItem = getCartItem(product.id);
            return (
              <div key={product.id} className="product-card">
                {product.image && <img src={product.image} alt={product.name} className="product-image" />}
                <h3>{product.name}</h3>
                <p className="product-price">₹{product.price}</p>
                {cartItem ? (
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => handleDecreaseQuantity(product.id)}>-</button>
                    <span className="item-qty">Qty: {cartItem.quantity}</span>
                    <button className="qty-btn" onClick={() => handleIncreaseQuantity(product.id)}>+</button>
                  </div>
                ) : (
                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* All Products Section */}
      {showProducts && (
        <section className="all-products">
          <h2>All Products</h2>
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const cartItem = getCartItem(product.id);
              return (
                <div key={product.id} className="product-card">
                  {product.image && <img src={product.image} alt={product.name} className="product-image" />}
                  <h3>{product.name}</h3>
                  <p className="product-price">₹{product.price}</p>
                  {cartItem ? (
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => handleDecreaseQuantity(product.id)}>-</button>
                      <span className="item-qty">Qty: {cartItem.quantity}</span>
                      <button className="qty-btn" onClick={() => handleIncreaseQuantity(product.id)}>+</button>
                    </div>
                  ) : (
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Home;
