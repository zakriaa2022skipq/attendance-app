import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateLoginStatus: (state, action) => {
      const stateRef = state;
      stateRef.isLoggedIn = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateLoginStatus } = authSlice.actions;

export default authSlice.reducer;
