import { FakeAuthGateway } from "@repo/core/auth/adapters/fake-auth.gateway";
import { createTestStore } from "@repo/core/create-store";
import { stateBuilder } from "@repo/core/state-builder";

describe("Feature: On auth state changed listeners", () => {
	test("Example: John is authenticated", () => {
		const authGateway = new FakeAuthGateway();
		const authUser = { id: "1234", name: "John Doe" };

		const store = createTestStore({
			authGateway,
		});

		authGateway.simulateAuthStateChanged(authUser);

		expect(store.getState()).toEqual(
			stateBuilder().withAuthChecked().withAuthUser(authUser).build(),
		);
	});

	test("Example: authentication has not already happened", () => {
		const store = createTestStore();
		expect(store.getState()).toEqual(stateBuilder().build());
	});
});
