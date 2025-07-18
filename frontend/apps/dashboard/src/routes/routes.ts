import { createBrowserRouter } from "react-router";
import { createAuthRoutes } from "./auth/auth.routes";
import { createDashboardRoutes } from "./dashboard/dashboard.routes";

export const createRouter = () =>
    createBrowserRouter([...createAuthRoutes(), ...createDashboardRoutes()]);
