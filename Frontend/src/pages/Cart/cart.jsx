import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, increaseQuantity, decreaseQuantity } from "../../redux/features/cartslice";
import Footer from "../../component/Footer";
import "../../style/Cart.css";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Your Shopping Cart</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty 🛒</p>
        </div>
      ) : (
        <div className="cart-content">
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="item-details">
                  <img
                    src={item.image || "https://via.placeholder.com/80"}
                    alt={item.name}
                    className="item-image"
                  />
                  <div>
                    <h4>{item.name}</h4>
                    <p className="item-price">₹{item.price}</p>
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => dispatch(decreaseQuantity(item.id))}>-</button>
                      <span className="item-qty">Qty: {item.quantity || 1}</span>
                      <button className="qty-btn" onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
                    </div>
                  </div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <h3>Total: ₹{total.toFixed(2)}</h3>
            <div className="cart-actions">
              <button className="clear-btn" onClick={handleClearCart}>
                Clear Cart
              </button>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
