import type { AuthGateway } from "../ports/auth.gateway";
import type { UserEntity } from "../user.entity";

export class FakeAuthGateway implements AuthGateway {
	isAuthWithGoogleRequested = false;
	willAuthWithGoogleAs: UserEntity | null = null;

	private onAuthStateChangedCallback:
		| ((user: UserEntity | null) => void)
		| null = null;

	onAuthStateChanged(callback: (user: UserEntity | null) => void) {
		this.onAuthStateChangedCallback = callback;
	}

	async authWithGoogle() {
		this.isAuthWithGoogleRequested = true;
		this.simulateAuthStateChanged(this.willAuthWithGoogleAs);
	}

	async logout() {
		this.simulateAuthStateChanged(null);
	}

	simulateAuthStateChanged(user: UserEntity | null) {
		this.onAuthStateChangedCallback?.(user);
	}
}
