import { createBrowserRouter } from "react-router";
import { createAuthRoutes } from "./auth/auth.routes";
import { createDashboardRoutes } from "./dashboard/dashboard.routes";
import { createOnboardingRoutes } from "./onboarding/onboarding.routes";

export const createRouter = () =>
	createBrowserRouter([
		...createAuthRoutes(),
		...createDashboardRoutes(),
		...createOnboardingRoutes(),
	]);
