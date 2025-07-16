import { Button } from "@repo/ui/components/button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/components/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Badge } from "@repo/ui/components/badge";
import { Building2, Bell, Settings, LogOut, User, Crown } from "lucide-react";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { useAppDispatch } from "~/hooks/store";
import { logout } from "@repo/core/auth/usecases/logout";

export function DashboardHeader() {
	const dispatch = useAppDispatch();
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-16 items-center gap-4 px-4">
				<SidebarTrigger />

				<div className="flex items-center space-x-2">
					<Building2 className="h-6 w-6 text-primary" />
					<span className="font-bold text-xl">HomeKeepr</span>
				</div>

				<div className="flex-1" />

				<div className="flex items-center space-x-4">
					<Button variant="ghost" size="icon" className="relative">
						<Bell className="h-5 w-5" />
						<Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
							3
						</Badge>
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="relative h-8 w-8 rounded-full">
								<Avatar className="h-8 w-8">
									<AvatarImage
										src="/placeholder.svg?height=32&width=32"
										alt="Avatar"
									/>
									<AvatarFallback>JD</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="end" forceMount>
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none">
										Jean Dupont
									</p>
									<p className="text-xs leading-none text-muted-foreground">
										jean.dupont@email.com
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								<span>Profil</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								<span>Paramètres</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Crown className="mr-2 h-4 w-4" />
								<span>Passer à Premium</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => dispatch(logout())}>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Se déconnecter</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
