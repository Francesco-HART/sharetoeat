import { Input } from "@repo/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Badge } from "@repo/ui/components/badge";
import { Flame, Zap, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "~/hooks/store";
import {
	type Equipement,
	nextStep,
	selectEquipments,
	updateEquipementConfig,
} from "@repo/core/onboarding/onboarding.slice";
import { useEffect, useRef, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@repo/ui/components/form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Switch } from "@repo/ui/components/switch";
import { toast } from "@repo/ui/components/sonner";

export function EquipmentConfigStep() {
	const dispatch = useAppDispatch();
	const equipments = useAppSelector((state) => selectEquipments(state));

	const [validations, setValidations] = useState<Record<string, boolean>>({
		smoke_detector: equipments.includes("smoke_detector"),
	});

	const handleFormValidityChange = (equipmentId: string, isValid: boolean) => {
		setValidations((prev) => ({ ...prev, [equipmentId]: isValid }));
	};

	const isAllValid = equipments.every((id) => validations[id]);

	const validEquipmentsCount =
		Object.values(validations).filter(Boolean).length;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isAllValid) {
			toast.error("Veuillez configurer tous les équipements");
			return;
		}
		dispatch(nextStep());
	};

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-2xl font-bold tracking-tight">
					Configuration des équipements
				</h1>
				<p className="text-muted-foreground">
					Configurez chaque équipement pour que nous puissions déterminer vos
					obligations légales précises.
				</p>
			</div>
			<form id="step" onSubmit={handleSubmit} className="space-y-4">
				<Accordion type="multiple" className="w-full space-y-4">
					{equipments.map((equipmentId) => {
						const EquipmentConfig = equipementsConfig[equipmentId];
						if (!EquipmentConfig) {
							return null;
						}
						return (
							<EquipmentConfig
								key={equipmentId}
								onValidChange={(isValid) =>
									handleFormValidityChange(equipmentId, isValid)
								}
							/>
						);
					})}
				</Accordion>
			</form>

			<div className="text-center space-y-4">
				<p className="text-sm text-muted-foreground">
					Ces informations nous permettent de calculer automatiquement vos
					obligations légales et leurs échéances
				</p>
				<div className="flex justify-center space-x-4 text-xs text-muted-foreground">
					<span>Configurés: {validEquipmentsCount}</span>
					<span>•</span>
					<span>Total: {equipments.length}</span>
				</div>
			</div>
		</div>
	);
}

const ConfigurationBadge: FC<{ isConfigured: boolean }> = ({ isConfigured }) =>
	isConfigured ? (
		<Badge
			variant="secondary"
			className="mr-2 bg-green-50 text-gray-500 border-green-200"
		>
			<CheckCircle className="h-3 w-3 mr-1 text-green-500" />
			Configuré
		</Badge>
	) : (
		<Badge variant="outline" className="mr-2">
			à configurer
		</Badge>
	);

const BoilerConfigSchema = yup.object({
	type: yup.string().required(),
	puissance: yup.number().positive().required(),
	lastMaintenance: yup.string(),
});

const boilerCombustionTypes = [
	{
		label: "Gaz",
		value: "gaz",
	},
	{
		label: "Bois",
		value: "wood",
	},
	{
		label: "Granules",
		value: "granule",
	},
];

const BoilerEquipementConfig: FC<{
	onValidChange: (valid: boolean) => void;
}> = ({ onValidChange }) => {
	const dispatch = useAppDispatch();
	const boiler = useAppSelector(
		(state) => state.onboarding.formData.equipements.configs.boiler,
	);
	const form = useForm({
		resolver: yupResolver(BoilerConfigSchema),
		mode: "onChange",
		defaultValues: boiler as any,
	});

	useEffect(() => {
		const subscription = form.watch((values) => {
			dispatch(updateEquipementConfig({ id: "boiler", config: values }));
		});

		return () => subscription.unsubscribe();
	}, [form, dispatch]);

	const isValid = form.formState.isValid;

	const prevValid = useRef(isValid);

	useEffect(() => {
		if (prevValid.current !== isValid) {
			prevValid.current = isValid;
			onValidChange(isValid);
		}
	}, [isValid, onValidChange]);

	return (
		<AccordionItem
			value="boiler"
			className="border rounded-lg px-4 data-[state=open]:bg-muted/30"
		>
			<AccordionTrigger className="hover:no-underline">
				<div className="flex items-center space-x-3 w-full">
					<Flame className="h-5 w-5 text-red-500" />
					<span className="font-medium">Chaudière</span>
					<div className="flex-1" />
					<ConfigurationBadge isConfigured={isValid} />
				</div>
			</AccordionTrigger>
			<AccordionContent className="pt-4 pb-2">
				<Form {...form}>
					<div className="grid gap-4">
						<FormField
							name="type"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Type de combustion</FormLabel>
										<FormControl>
											<Select {...field} onValueChange={field.onChange}>
												<SelectTrigger>
													<SelectValue placeholder="Sélectionnez une option" />
												</SelectTrigger>
												<SelectContent>
													{boilerCombustionTypes.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							name="puissance"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Puissance (kW)</FormLabel>
										<FormControl>
											<Input placeholder="ex: 24" type="number" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							name="lastMaintenance"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Dernière révision</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
					</div>
				</Form>
			</AccordionContent>
		</AccordionItem>
	);
};

const ElectricInstallationConfigSchema = yup.object({
	installationDate: yup.string().required(),
	lastMaintenance: yup.string(),
});

const ElectricInstallationConfig: FC<{
	onValidChange: (valid: boolean) => void;
}> = ({ onValidChange }) => {
	const dispatch = useAppDispatch();
	const electrical = useAppSelector(
		(state) =>
			state.onboarding.formData.equipements.configs.electrical_installation,
	);
	const form = useForm({
		resolver: yupResolver(ElectricInstallationConfigSchema),
		mode: "onChange",
		defaultValues: electrical as any,
	});

	useEffect(() => {
		const subscription = form.watch((values) => {
			dispatch(
				updateEquipementConfig({
					id: "electrical_installation",
					config: values,
				}),
			);
		});

		return () => subscription.unsubscribe();
	}, [form, dispatch]);

	const isValid = form.formState.isValid;

	const prevValid = useRef(isValid);

	useEffect(() => {
		if (prevValid.current !== isValid) {
			prevValid.current = isValid;
			onValidChange(isValid);
		}
	}, [isValid, onValidChange]);

	return (
		<AccordionItem
			value="electric_installation"
			className="border rounded-lg px-4 data-[state=open]:bg-muted/30"
		>
			<AccordionTrigger className="hover:no-underline">
				<div className="flex items-center space-x-3 w-full">
					<Zap className="h-5 w-5 text-yellow-500" />
					<span className="font-medium">Installation électrique</span>
					<div className="flex-1" />
					<ConfigurationBadge isConfigured={isValid} />
				</div>
			</AccordionTrigger>
			<AccordionContent className="pt-4 pb-2">
				<Form {...form}>
					<div className="grid gap-4">
						<FormField
							name="installationDate"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Date d'installation</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							name="lastDiagnostic"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Dernier diagnostic</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
					</div>
				</Form>
			</AccordionContent>
		</AccordionItem>
	);
};

const ChemineyConfigSchema = yup.object({
	hasConduit: yup.boolean(),
	lastSweeping: yup.string(),
});

const ChemineyConfig: FC<{
	onValidChange: (valid: boolean) => void;
}> = ({ onValidChange }) => {
	const dispatch = useAppDispatch();
	const cheminey = useAppSelector(
		(state) => state.onboarding.formData.equipements.configs.cheminey,
	);
	const form = useForm({
		resolver: yupResolver(ChemineyConfigSchema),
		mode: "onChange",
		defaultValues: cheminey as any,
	});

	useEffect(() => {
		const subscription = form.watch((values) => {
			dispatch(
				updateEquipementConfig({
					id: "cheminey",
					config: values,
				}),
			);
		});

		return () => subscription.unsubscribe();
	}, [form, dispatch]);

	const isValid = form.formState.isValid;

	const prevValid = useRef(isValid);

	useEffect(() => {
		if (prevValid.current !== isValid) {
			prevValid.current = isValid;
			onValidChange(isValid);
		}
	}, [isValid, onValidChange]);

	return (
		<AccordionItem
			value="cheminey"
			className="border rounded-lg px-4 data-[state=open]:bg-muted/30"
		>
			<AccordionTrigger className="hover:no-underline">
				<div className="flex items-center space-x-3 w-full">
					<Zap className="h-5 w-5 text-orange-500" />
					<span className="font-medium">Cheminée / Poêle</span>
					<div className="flex-1" />
					<ConfigurationBadge isConfigured={isValid} />
				</div>
			</AccordionTrigger>
			<AccordionContent className="pt-4 pb-2">
				<Form {...form}>
					<div className="grid gap-4">
						<FormField
							name="hasConduit"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>A un conduit d'évacuation</FormLabel>
										<FormControl>
											<Switch {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							name="lastSweeping"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Dernier ramonage</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
					</div>
				</Form>
			</AccordionContent>
		</AccordionItem>
	);
};

const equipementsConfig: Partial<
	Record<Equipement, FC<{ onValidChange: (valid: boolean) => void }>>
> = {
	boiler: BoilerEquipementConfig,
	electrical_installation: ElectricInstallationConfig,
	cheminey: ChemineyConfig,
};
