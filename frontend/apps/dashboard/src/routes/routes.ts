import { createBrowserRouter } from "react-router";
import { createAuthRoutes } from "./auth/auth.routes";
import { createDashboardRoutes } from "./dashboard/dashboard.routes";
import { createGenerationRoutes } from "./generation/generation.routes";

export const createRouter = () =>
	createBrowserRouter([
		...createAuthRoutes(),
		...createDashboardRoutes(),
		...createGenerationRoutes(),
	]);
