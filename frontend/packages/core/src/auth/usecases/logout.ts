import { createAppAsyncThunk } from "@repo/core/create-app-async-thunk";

export const logout = createAppAsyncThunk(
	"auth/logout",
	(_, { extra: { authGateway } }) => {
		authGateway.logout();
	},
);
