import type { RouteObject } from "react-router";
import { LoginPage } from "./login/login.page";

export const createAuthRoutes = (): RouteObject[] => [
	{
		path: "/auth",
		children: [
			{
				path: "login",
				Component: LoginPage,
			},
		],
	},
];
