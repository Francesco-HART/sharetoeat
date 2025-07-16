import { Card, CardContent } from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Badge } from "@repo/ui/components/badge";
import { Flame, Zap, Lightbulb, AlarmSmoke } from "lucide-react";
import { useAppDispatch, useAppSelector } from "~/hooks/store";
import {
	addEquipements,
	type Equipement,
	nextStep,
	removeEquipments,
	selectEquipments,
} from "@repo/core/onboarding/onboarding.slice";

const equipmentTypes: {
	id: Equipement;
	name: string;
	description: string;
	icon: any;
	obligations: string[];
	color: string;
}[] = [
	{
		id: "boiler",
		name: "Chaudière",
		description: "Chaudière pour chauffage et/ou eau chaude",
		icon: Flame,
		obligations: ["Entretien annuel", "Ramonage annuel si evacuation"],
		color: "text-red-500",
	},
	{
		id: "cheminey",
		name: "Cheminée / Poêle",
		description: "Cheminée, poêle à bois ou insert",
		icon: Flame,
		obligations: ["Ramonage annuel"],
		color: "text-orange-500",
	},
	{
		id: "electrical_installation",
		name: "Installation électrique",
		description: "Tableau électrique et installation",
		icon: Zap,
		obligations: ["Diagnostic si > 15 ans"],
		color: "text-yellow-500",
	},
	{
		id: "smoke_detector",
		name: "Détecteur de fumée",
		description: "Détecteur de fumée",
		icon: AlarmSmoke,
		obligations: ["Installation initial"],
		color: "text-green-500",
	},
];

export function EquipmentSelectionStep() {
	const dispatch = useAppDispatch();
	const equipments = useAppSelector((state) => selectEquipments(state));

	const handleEquipmentToggle = (equipmentId: Equipement, checked: boolean) => {
		if (checked) {
			dispatch(addEquipements(equipmentId));
			return;
		}
		dispatch(removeEquipments(equipmentId));
	};

	const handleSubmit = () => {
		dispatch(nextStep());
	};

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-2xl font-bold tracking-tight">
					Équipements présents
				</h1>
				<p className="text-muted-foreground">
					Sélectionnez tous les équipements présents dans votre logement. Cela
					nous permettra de déterminer automatiquement vos obligations légales.
				</p>
			</div>
			<form
				id="step"
				onSubmit={handleSubmit}
				className="space-y-4 grid gap-4 md:grid-cols-2"
			>
				{equipmentTypes.map((equipment) => {
					const Icon = equipment.icon;
					const isSelected = equipments.includes(equipment.id) || false;

					return (
						<Card
							key={equipment.id}
							className={`cursor-pointer transition-all hover:shadow-md ${
								isSelected ? "ring-2 ring-primary bg-primary/5" : ""
							}`}
						>
							<CardContent className="p-4">
								<div className="flex items-start space-x-3">
									<Checkbox
										checked={isSelected}
										className="mt-1"
										onClick={() => {
											handleEquipmentToggle(equipment.id, !isSelected);
										}}
									/>
									<div className="flex-1 space-y-2">
										<div className="flex items-center space-x-2">
											<Icon className={`h-5 w-5 ${equipment.color}`} />
											<h3 className="font-medium">{equipment.name}</h3>
										</div>
										<p className="text-sm text-muted-foreground">
											{equipment.description}
										</p>
										<div className="flex flex-wrap gap-1">
											{equipment.obligations.map((obligation) => (
												<Badge
													key={obligation}
													variant="outline"
													className="text-xs"
												>
													{obligation}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</form>

			{equipments?.length > 0 && (
				<Card className="bg-primary/5 border-primary/20">
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<Lightbulb className="h-5 w-5 text-primary" />
							<div>
								<p className="font-medium">
									Équipements sélectionnés : {equipments.length}
								</p>
								<p className="text-sm text-muted-foreground">
									À l'étape suivante, nous configurerons chaque équipement pour
									déterminer vos obligations précises.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			<p className="text-sm text-muted-foreground text-center">
				Vous pourrez toujours modifier ces informations plus tard depuis votre
				tableau de bord
			</p>
		</div>
	);
}
