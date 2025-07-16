import { createAppAsyncThunk } from "@repo/core/create-app-async-thunk";

export const determineLegalObligations = createAppAsyncThunk(
  "property/determine-legal-obligations",
  (propertyId: string, { extra: { propertyGateway } }) => {
    return propertyGateway.determineLegalObligations(propertyId);
  }
);
