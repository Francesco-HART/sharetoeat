import type { FC } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import {
	Calendar,
	Building,
	AlertTriangle,
	CheckCircle,
	Plus,
	FileText,
	Wrench,
} from "lucide-react";

export const DashboardPage: FC = () => {
	const upcomingObligations = [
		{
			property: "Appartement Rue de la Paix",
			obligation: "Contrôle gaz",
			dueDate: "Dans 15 jours",
			status: "urgent",
			date: "15 Mars 2024",
		},
		{
			property: "Studio Boulevard Voltaire",
			obligation: "Entretien chaudière",
			dueDate: "Dans 23 jours",
			status: "warning",
			date: "23 Mars 2024",
		},
		{
			property: "Appartement Rue de la Paix",
			obligation: "Ramonage cheminée",
			dueDate: "Dans 45 jours",
			status: "ok",
			date: "14 Avril 2024",
		},
	];

	const properties = [
		{
			name: "Appartement Rue de la Paix",
			address: "123 Rue de la Paix, 75001 Paris",
			status: "À jour",
			nextObligation: "Contrôle gaz - 15 Mars",
		},
		{
			name: "Studio Boulevard Voltaire",
			address: "45 Boulevard Voltaire, 75011 Paris",
			status: "Action requise",
			nextObligation: "Entretien chaudière - 23 Mars",
		},
	];

	return (
		<div className="flex-1 space-y-6 p-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
				<p className="text-muted-foreground">
					Gérez vos obligations légales en toute simplicité
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Logements</CardTitle>
						<Building className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">2</div>
						<p className="text-xs text-muted-foreground">
							Limite gratuite atteinte
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Échéances urgentes
						</CardTitle>
						<AlertTriangle className="h-4 w-4 text-red-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">1</div>
						<p className="text-xs text-muted-foreground">
							Action requise sous 30 jours
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Obligations à jour
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">5</div>
						<p className="text-xs text-muted-foreground">
							Sur 7 obligations totales
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Documents</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">12</div>
						<p className="text-xs text-muted-foreground">
							Stockés et organisés
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Prochaines échéances */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Calendar className="h-5 w-5" />
							<span>Prochaines échéances</span>
						</CardTitle>
						<CardDescription>
							Obligations à venir dans les 60 prochains jours
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{upcomingObligations.map((obligation, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-3 border rounded-lg"
							>
								<div className="flex-1">
									<div className="flex items-center space-x-2 mb-1">
										<h4 className="font-medium text-sm">
											{obligation.obligation}
										</h4>
										<Badge
											variant={
												obligation.status === "urgent"
													? "destructive"
													: obligation.status === "warning"
														? "default"
														: "secondary"
											}
											className="text-xs"
										>
											{obligation.dueDate}
										</Badge>
									</div>
									<p className="text-xs text-muted-foreground">
										{obligation.property}
									</p>
									<p className="text-xs text-muted-foreground">
										{obligation.date}
									</p>
								</div>
								<Button size="sm" variant="outline">
									<Wrench className="h-3 w-3 mr-1" />
									Planifier
								</Button>
							</div>
						))}
						<Button variant="outline" className="w-full">
							<Calendar className="h-4 w-4 mr-2" />
							Voir le calendrier complet
						</Button>
					</CardContent>
				</Card>

				{/* Mes logements */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Building className="h-5 w-5" />
								<span>Mes logements</span>
							</div>
							<Button size="sm" disabled>
								<Plus className="h-4 w-4 mr-1" />
								Ajouter
							</Button>
						</CardTitle>
						<CardDescription>Limite gratuite : 2/2 logements</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{properties.map((property, index) => (
							<div key={index} className="p-4 border rounded-lg space-y-3">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<h4 className="font-medium">{property.name}</h4>
										<p className="text-sm text-muted-foreground">
											{property.address}
										</p>
									</div>
									<Badge
										variant={
											property.status === "À jour" ? "secondary" : "destructive"
										}
										className="text-xs"
									>
										{property.status}
									</Badge>
								</div>

								<div className="flex items-center justify-between">
									<p className="text-xs text-muted-foreground">
										Prochaine : {property.nextObligation}
									</p>
									<Button size="sm" variant="ghost">
										Détails
									</Button>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Actions rapides */}
			<Card>
				<CardHeader>
					<CardTitle>Actions rapides</CardTitle>
					<CardDescription>
						Accédez rapidement aux fonctionnalités principales
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Button variant="outline" className="h-20 flex-col space-y-2">
							<FileText className="h-6 w-6" />
							<span className="text-sm">Ajouter un document</span>
						</Button>
						<Button variant="outline" className="h-20 flex-col space-y-2">
							<Calendar className="h-6 w-6" />
							<span className="text-sm">Planifier une intervention</span>
						</Button>
						<Button
							variant="outline"
							className="h-20 flex-col space-y-2"
							disabled
						>
							<Wrench className="h-6 w-6" />
							<span className="text-sm">Trouver un artisan</span>
							<Badge variant="secondary" className="text-xs">
								Premium
							</Badge>
						</Button>
						<Button variant="outline" className="h-20 flex-col space-y-2">
							<CheckCircle className="h-6 w-6" />
							<span className="text-sm">Marquer comme fait</span>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
