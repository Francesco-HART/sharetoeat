import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import {
	Calendar,
	FileText,
	Users,
	Bell,
	Upload,
	Search,
	Smartphone,
	Shield,
	Clock,
} from "lucide-react";

export function Features() {
	const features = [
		{
			icon: Calendar,
			title: "Calendrier intelligent",
			description:
				"Base de données complète des obligations par type de logement avec notifications automatiques",
			items: [
				"Notifications 30/15/7 jours avant",
				"Intégration Google Calendar",
				"Rappels personnalisables",
			],
		},
		{
			icon: FileText,
			title: "Stockage documents",
			description:
				"Organisez et retrouvez tous vos documents légaux en quelques clics",
			items: [
				"Upload et catégorisation auto",
				"OCR pour extraire les dates",
				"Liens locataires/artisans",
			],
		},
		{
			icon: Users,
			title: "Réseau d'artisans",
			description:
				"Accédez à un annuaire local de professionnels certifiés et de confiance",
			items: [
				"Annuaire local certifié",
				"Demandes de devis intégrées",
				"Historique des interventions",
			],
		},
	];

	const additionalFeatures = [
		{
			icon: Bell,
			title: "Notifications multi-canal",
			description: "Email, SMS et push",
		},
		{
			icon: Smartphone,
			title: "Application mobile",
			description: "Gérez vos biens partout",
		},
		{
			icon: Shield,
			title: "Données sécurisées",
			description: "Hébergement français RGPD",
		},
		{
			icon: Search,
			title: "Recherche avancée",
			description: "Trouvez vos documents rapidement",
		},
		{
			icon: Clock,
			title: "Historique complet",
			description: "Suivez toutes vos interventions",
		},
		{
			icon: Upload,
			title: "Import facile",
			description: "Importez vos données existantes",
		},
	];

	return (
		<section id="fonctionnalites" className="py-20">
			<div className="container">
				<div className="text-center mb-16">
					<Badge variant="secondary" className="mb-4">
						Fonctionnalités
					</Badge>
					<h2 className="text-3xl font-bold mb-4">
						Tout ce dont vous avez besoin pour être en conformité
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Une solution complète pensée spécialement pour les petits
						propriétaires bailleurs français
					</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8 mb-16">
					{features.map((feature) => {
						const Icon = feature.icon;
						return (
							<Card
								key={feature.title}
								className="border-primary/10 hover:border-primary/30 transition-colors"
							>
								<CardHeader>
									<div className="flex items-center space-x-3 mb-2">
										<div className="p-2 bg-primary/10 rounded-lg">
											<Icon className="h-6 w-6 text-primary" />
										</div>
										<CardTitle className="text-xl">{feature.title}</CardTitle>
									</div>
									<p className="text-muted-foreground">{feature.description}</p>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{feature.items.map((item) => (
											<li
												key={item}
												className="flex items-center space-x-2 text-sm"
											>
												<div className="w-1.5 h-1.5 bg-primary rounded-full" />
												<span>{item}</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						);
					})}
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{additionalFeatures.map((feature) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.title}
								className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg"
							>
								<Icon className="h-5 w-5 text-primary mt-0.5" />
								<div>
									<h4 className="font-medium mb-1">{feature.title}</h4>
									<p className="text-sm text-muted-foreground">
										{feature.description}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
