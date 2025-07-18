import type { RouteObject } from "react-router";
import { DashboardPage } from "./dashboard.page";
import { ProtectedRoute } from "../protected-route";
import { DashboardLayout } from "./components/dashboard-layout";

export const createDashboardRoutes = (): RouteObject[] => [
    {
        path: "/",
        Component: ProtectedRoute,
        children: [
            {
                Component: DashboardLayout,
                children: [
                    {
                        index: true,
                        Component: DashboardPage,
                    },
                ],
            },
        ],
    },
];
