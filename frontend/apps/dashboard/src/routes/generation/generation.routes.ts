import type { RouteObject } from "react-router";
import { GenerationPage } from "./generation.page";
import type { AppDispatch } from "@repo/core/create-store";

export const createGenerationRoutes = (): RouteObject[] => [
	{
		path: "/shop/:id/generation",
		Component: GenerationPage,
	},
];
