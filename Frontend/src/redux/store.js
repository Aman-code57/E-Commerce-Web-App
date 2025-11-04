import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartslice"
import productReducer from "./features/productslice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
  },
});

export default store;
