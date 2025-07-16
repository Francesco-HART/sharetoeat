import type {
	AuthGateway,
	OnAuthStateChangedCallback,
} from "../ports/auth.gateway";
import type { UserEntity } from "../user.entity";
import { FakeAuthGateway } from "./fake-auth.gateway";

const LOCAL_STORAGE_CURRENT_USER_KEY = "currentUser";

export class LocalStorageAuthGateway implements AuthGateway {
	private onAuthStateChangedCallback?: OnAuthStateChangedCallback;
	private fakeAuthGateway: FakeAuthGateway;

	constructor(fakeAuthGateway: FakeAuthGateway) {
		this.fakeAuthGateway = fakeAuthGateway;
	}

	onAuthStateChanged(callback: OnAuthStateChangedCallback) {
		this.onAuthStateChangedCallback = function (user) {
			if (user) {
				this.saveCurrentUser(user);
			} else {
				localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
			}
			callback(user);
		};
		this.checkAuth();
		return this.fakeAuthGateway.onAuthStateChanged(
			this.onAuthStateChangedCallback.bind(this),
		);
	}

	authWithGoogle() {
		return this.fakeAuthGateway.authWithGoogle();
	}

	logout() {
		return this.fakeAuthGateway.logout();
	}

	private saveCurrentUser(user: UserEntity) {
		localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
	}

	private checkAuth() {
		const user = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
		if (user) {
			this.onAuthStateChangedCallback?.(JSON.parse(user));
			return;
		}
		this.onAuthStateChangedCallback?.(null);
	}
}
