import type { AppStore } from "@repo/core/create-store";
import type { AuthGateway } from "../ports/auth.gateway";
import { userAuthenticated } from "../auth.slice";

export const onAuthStateChangedListener = ({
	store,
	authGateway,
}: {
	store: AppStore;
	authGateway: AuthGateway;
}) => {
	authGateway.onAuthStateChanged((user) => {
		store.dispatch(userAuthenticated(user));
	});
};
