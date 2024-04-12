// userSlice.js

import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  loginUserDetails: null, // Change to null to represent no logged-in user
};

const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    getUserLoginDetails: (state, action) => {
      const userDetails = action.payload;
      return { ...state, loginUserDetails: userDetails };
    },
    updateUserDetails: (state, action) => {
      const updatedUserDetails = action.payload;
      return { ...state, loginUserDetails: updatedUserDetails };
    },
    logoutUser: (state) => {
      return { ...state, loginUserDetails: null }; // Reset loginUserDetails to null on logout
    },
  },
});

export const { getUserLoginDetails,updateUserDetails, logoutUser } = userSlice.actions;

export default userSlice.reducer;
