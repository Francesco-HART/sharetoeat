import { combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./auth/auth.slice";
import { propertiesSlice } from "./properties/properties.slice";
import { onboardingSlice } from "./onboarding/onboarding.slice";

export const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [propertiesSlice.name]: propertiesSlice.reducer,
  [onboardingSlice.name]: onboardingSlice.reducer,
});
