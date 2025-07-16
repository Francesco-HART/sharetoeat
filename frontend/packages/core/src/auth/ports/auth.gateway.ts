import type { UserEntity } from "../user.entity";

export type OnAuthStateChangedCallback = (user: UserEntity | null) => void;
export type AuthGateway = {
	onAuthStateChanged: (callback: OnAuthStateChangedCallback) => void;
	authWithGoogle: () => Promise<void>;
	logout: () => Promise<void>;
};
