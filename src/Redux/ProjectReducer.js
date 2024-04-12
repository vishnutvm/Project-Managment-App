import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  projectDetails: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState: INITIAL_STATE,
  reducers: {
    getProjectDetails: (state, action) => {
      const projectDetails = action.payload;
      return { ...state, projectDetails: projectDetails };
    },
  },
});

export const { getProjectDetails } = projectSlice.actions;

export default projectSlice.reducer;
