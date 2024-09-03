import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: null,
  email: null,
  name: null,
  username: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserState: (state, action) => {
      const stateRef = state;
      stateRef._id = action.payload._id;
      stateRef.email = action.payload.email;
      stateRef.name = action.payload.name;
      stateRef.username = action.payload.username;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUserState } = userSlice.actions;

export default userSlice.reducer;
