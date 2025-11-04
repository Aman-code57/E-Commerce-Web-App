import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../../redux/features/cartslice';
import '../../style/Cart.css';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - ₹{item.price}
                <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <p>Total: ₹{total}</p>
          <button onClick={handleClearCart}>Clear Cart</button>
          <button>Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;
