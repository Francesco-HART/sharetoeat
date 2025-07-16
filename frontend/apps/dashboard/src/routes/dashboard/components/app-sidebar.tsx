import {
	Calendar,
	Home,
	Building,
	FileText,
	Users,
	Settings,
	HelpCircle,
	Crown,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarHeader,
} from "@repo/ui/components/sidebar";
import { Badge } from "@repo/ui/components/badge";
import { NavLink } from "react-router";

const items = [
	{
		title: "Tableau de bord",
		url: "/",
		icon: Home,
	},
	{
		title: "Calendrier",
		url: "#",
		icon: Calendar,
		badge: "2",
	},
	{
		title: "Mes logements",
		url: "properties",
		icon: Building,
	},
	{
		title: "Documents",
		url: "#",
		icon: FileText,
	},
	{
		title: "Artisans",
		url: "#",
		icon: Users,
		premium: true,
	},
];

const supportItems = [
	{
		title: "Paramètres",
		url: "#",
		icon: Settings,
	},
	{
		title: "Aide",
		url: "#",
		icon: HelpCircle,
	},
];

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center justify-between p-2">
					<div className="flex items-center space-x-2">
						<div className="w-2 h-2 bg-green-500 rounded-full" />
						<span className="text-sm font-medium">Version gratuite</span>
					</div>
					<Badge variant="outline" className="text-xs">
						2/2 logements
					</Badge>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<NavLink
											to={item.url}
											className="flex items-center justify-between w-full"
										>
											<div className="flex items-center space-x-2">
												<item.icon />
												<span>{item.title}</span>
											</div>
											<div className="flex items-center space-x-1">
												{item.badge && (
													<Badge
														variant="destructive"
														className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
													>
														{item.badge}
													</Badge>
												)}
												{item.premium && (
													<Crown className="h-3 w-3 text-primary" />
												)}
											</div>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Support</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{supportItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<div className="p-4 bg-primary/5 rounded-lg mx-2 mb-2">
					<div className="flex items-start space-x-2">
						<Crown className="h-4 w-4 text-primary mt-0.5" />
						<div className="flex-1">
							<p className="text-sm font-medium">Passez à Premium</p>
							<p className="text-xs text-muted-foreground mb-2">
								Logements illimités + réseau d'artisans
							</p>
							<button
								type="button"
								className="text-xs text-primary hover:underline"
							>
								Découvrir →
							</button>
						</div>
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
