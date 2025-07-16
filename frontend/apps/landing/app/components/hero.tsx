import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { Calendar, Shield, Users } from "lucide-react";
import { NavLink } from "react-router";

export function Hero() {
	return (
		<section className="relative py-20 lg:py-32 overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-amber-50" />
			<div className="container relative">
				<div className="mx-auto max-w-4xl text-center">
					<Badge variant="secondary" className="mb-6">
						🇫🇷 Spécialement conçu pour la réglementation française
					</Badge>

					<h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
						Le seul outil <span className="text-primary">100% dédié</span> aux
						obligations légales du bailleur
					</h1>

					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						Ne ratez plus jamais une échéance légale. Gérez facilement vos
						diagnostics, contrôles et entretiens pour tous vos logements en
						location.
					</p>

					<div className="flex justify-center mb-12">
						<Button size="lg" className="text-lg px-8" asChild>
							<NavLink to="/login">Commencer gratuitement</NavLink>
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
						<div className="flex flex-col items-center">
							<Calendar className="h-12 w-12 text-primary mb-4" />
							<h3 className="font-semibold mb-2">Calendrier intelligent</h3>
							<p className="text-sm text-muted-foreground">
								Notifications automatiques avant chaque échéance
							</p>
						</div>
						<div className="flex flex-col items-center">
							<Shield className="h-12 w-12 text-primary mb-4" />
							<h3 className="font-semibold mb-2">Conformité garantie</h3>
							<p className="text-sm text-muted-foreground">
								Base de données à jour des obligations légales
							</p>
						</div>
						<div className="flex flex-col items-center">
							<Users className="h-12 w-12 text-primary mb-4" />
							<h3 className="font-semibold mb-2">Réseau d'artisans</h3>
							<p className="text-sm text-muted-foreground">
								Trouvez facilement des professionnels certifiés
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
