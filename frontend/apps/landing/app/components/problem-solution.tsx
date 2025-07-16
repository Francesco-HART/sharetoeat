import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import {
	AlertTriangle,
	CheckCircle,
	Clock,
	FileText,
	Wrench,
} from "lucide-react";

export function ProblemSolution() {
	const obligations = [
		{ name: "DPE", frequency: 10, icon: FileText },
		{ name: "Contrôle gaz", frequency: 3, icon: Wrench },
		{ name: "Diagnostic électrique", frequency: 6, icon: CheckCircle },
		{ name: "Ramonage", frequency: 1, icon: Clock },
		{ name: "Entretien chaudière", frequency: 1, icon: Wrench },
	];

	function formatFrequency(years: number) {
		return years === 1 ? "Annuel" : `Tous les ${years} ans`;
	}

	return (
		<section id="probleme" className="py-20 bg-muted/30">
			<div className="container">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div>
						<h2 className="text-3xl font-bold mb-6">
							Vous êtes propriétaire bailleur ?
							<span className="text-primary">
								{" "}
								Ces obligations vous concernent
							</span>
						</h2>

						<div className="space-y-4 mb-8">
							{obligations.map((obligation) => {
								const Icon = obligation.icon;
								return (
									<div
										key={obligation.name}
										className="flex items-center space-x-3 p-3 bg-background rounded-lg border"
									>
										<Icon className="h-5 w-5 text-primary" />
										<span className="font-medium">{obligation.name}</span>
										<span className="text-sm text-muted-foreground ml-auto">
											{formatFrequency(obligation.frequency)}
										</span>
									</div>
								);
							})}
						</div>

						<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
							<div className="flex items-start space-x-3">
								<AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
								<div>
									<h4 className="font-semibold text-red-800 mb-1">
										Attention !
									</h4>
									<p className="text-sm text-red-700">
										Le non-respect de ces obligations peut entraîner des
										amendes, la résiliation du bail ou votre responsabilité en
										cas d'accident.
									</p>
								</div>
							</div>
						</div>
					</div>

					<div>
						<Card className="border-primary/20">
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<CheckCircle className="h-6 w-6 text-primary" />
									<span>Notre solution</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-start space-x-3">
									<div className="w-2 h-2 bg-primary rounded-full mt-2" />
									<div>
										<h4 className="font-medium">Calendrier automatisé</h4>
										<p className="text-sm text-muted-foreground">
											Recevez des notifications 30, 15 et 7 jours avant chaque
											échéance
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-3">
									<div className="w-2 h-2 bg-primary rounded-full mt-2" />
									<div>
										<h4 className="font-medium">Stockage sécurisé</h4>
										<p className="text-sm text-muted-foreground">
											Tous vos documents organisés et accessibles en un clic
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-3">
									<div className="w-2 h-2 bg-primary rounded-full mt-2" />
									<div>
										<h4 className="font-medium">Réseau d'artisans</h4>
										<p className="text-sm text-muted-foreground">
											Trouvez rapidement des professionnels certifiés près de
											chez vous
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
}
