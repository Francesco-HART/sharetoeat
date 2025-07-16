import { createAppAsyncThunk } from "@repo/core/create-app-async-thunk";

export const authWithGoogle = createAppAsyncThunk(
	"auth/authWithGoogle",
	(_, { extra: { authGateway } }) => {
		return authGateway.authWithGoogle();
	},
);
