import { createSlice } from "@reduxjs/toolkit";
import { propertiesAdapter } from "./property.entity";
import { determineLegalObligations } from "./usecases/determine-property-legal-obligations";

const initialState = propertiesAdapter.getInitialState();

export const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(determineLegalObligations.fulfilled, (state, action) => {
      propertiesAdapter.updateOne(state, {
        id: action.meta.arg,
        changes: {
          legalObligations: action.payload,
        },
      });
      state.entities[action.meta.arg].legalObligations = action.payload;
    });
  },
});
