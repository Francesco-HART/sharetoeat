import { Button } from "@repo/ui/components/button";
import { Building2, Menu } from "lucide-react";
import { NavLink } from "react-router";

export function Header() {
	const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL;

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				<NavLink to="/" className="flex items-center space-x-2">
					<Building2 className="h-6 w-6 text-primary" />
					<span className="font-bold text-xl">HomeKeepr</span>
				</NavLink>

				<nav className="hidden md:flex items-center space-x-6">
					<NavLink
						to="#fonctionnalites"
						className="text-sm font-medium hover:text-primary transition-colors"
					>
						Fonctionnalités
					</NavLink>
					<NavLink
						to="#probleme"
						className="text-sm font-medium hover:text-primary transition-colors"
					>
						Pourquoi nous ?
					</NavLink>
				</nav>

				<div className="flex items-center space-x-4">
					<Button variant="ghost" className="hidden md:inline-flex" asChild>
						<NavLink to={dashboardUrl}>Se connecter</NavLink>
					</Button>
					<Button>Commencer gratuitement</Button>
					<Button variant="ghost" size="icon" className="md:hidden">
						<Menu className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</header>
	);
}
