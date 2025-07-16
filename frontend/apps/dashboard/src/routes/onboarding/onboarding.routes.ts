import type { RouteObject } from "react-router";
import { OnboardingPage } from "./onboarding.page";
import { ProtectedRoute } from "../protected-route";

export const createOnboardingRoutes = (): RouteObject[] => {
	return [
		{
			path: "/onboarding",
			Component: ProtectedRoute,
			children: [
				{
					index: true,
					Component: OnboardingPage,
				},
			],
		},
	];
};
