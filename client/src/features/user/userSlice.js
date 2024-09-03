import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: null,
  email: null,
  firstName: null,
  lastName: null,
  lessons: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserState: (state, action) => {
      const stateRef = state;
      stateRef._id = action.payload._id;
      stateRef.email = action.payload.email;
      stateRef.lastName = action.payload.lastName;
      stateRef.firstName = action.payload.firstName;
      stateRef.lessons = action.payload.lessons;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUserState } = userSlice.actions;

export default userSlice.reducer;
