import { createSlice } from "@reduxjs/toolkit";

const initialProducts = [
  { id: 1, name: "T-shirt", price: 499, category: "clothes" },
  { id: 2, name: "Jeans", price: 999, category: "clothes" },
  { id: 3, name: "Sneakers", price: 1999, category: "clothes" },
  {id: 4, name: "mobile", price: 10000, category: "mobiles" },
];

const productSlice = createSlice({
  name: "products",
  initialState: { list: initialProducts, selectedCategory: "" },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setSelectedCategory } = productSlice.actions;
export default productSlice.reducer;
