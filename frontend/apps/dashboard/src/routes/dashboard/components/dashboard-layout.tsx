import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import type { FC } from "react";
import { DashboardHeader } from "./dashboard-header";
import { Outlet } from "react-router";
import { AppSidebar } from "./app-sidebar";

export const DashboardLayout: FC = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<DashboardHeader />
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
};
