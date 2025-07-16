import { createAction, createSlice } from "@reduxjs/toolkit";
import type { UserEntity } from "./user.entity";

export const userAuthenticated = createAction<UserEntity | null>(
	"auth/userAuthenticated",
);

export type AuthState = {
	user?: UserEntity;
	isChecked: boolean;
};

const initalState: AuthState = {
	isChecked: false,
};

export const authSlice = createSlice({
	name: "auth",
	initialState: initalState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(userAuthenticated, (state, action) => {
			state.user = action.payload ?? undefined;
			state.isChecked = true;
		});
	},
});
