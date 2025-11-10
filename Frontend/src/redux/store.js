import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartslice"
import productReducer from "./features/productslice";
import userReducer from "./features/Userslice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    user: userReducer,
  },
});

export default store;
