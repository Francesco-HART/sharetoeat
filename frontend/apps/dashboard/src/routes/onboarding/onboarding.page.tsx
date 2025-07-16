import { type FC } from "react";
import { Building2, Check } from "lucide-react";
import { WelcomeStep } from "./components/welcome-step";
import { PropertyInfoStep } from "./components/property-info-step";
import { CompletionStep } from "./components/completion-step";
import { TenantStep } from "./components/tenant-step";
import { EquipmentSelectionStep } from "./components/equipement-selection-step";
import { EquipmentConfigStep } from "./components/equipement-config-step";
import { useAppSelector } from "~/hooks/store";
import { Navigation } from "./components/navigation";

export const OnboardingPage: FC = () => {
	const currentStep = useAppSelector((state) => state.onboarding.currentStep);

	const allSteps = [
		{
			name: "Bienvenue",
			mobile: "Accueil",
			component: WelcomeStep,
			showInProgress: false,
		},
		{
			name: "Logement",
			mobile: "Logement",
			component: PropertyInfoStep,
			showInProgress: true,
		},
		{
			name: "Équipements",
			mobile: "Équipements",
			component: EquipmentSelectionStep,
			showInProgress: true,
		},
		{
			name: "Configuration",
			mobile: "Config",
			component: EquipmentConfigStep,
			showInProgress: true,
		},
		{
			name: "Location",
			mobile: "Location",
			component: TenantStep,
			showInProgress: true,
		},
		{
			name: "Terminé",
			mobile: "Fini",
			component: CompletionStep,
			showInProgress: true,
		},
	];

	// Steps to show in progress indicator (excluding welcome only)
	const progressSteps = allSteps.filter((step) => step.showInProgress);

	// Calculate progress step index (for steps that show in progress)
	const getProgressStepIndex = () => {
		if (currentStep === 0) {
			return -1; // Don't show progress for welcome
		}
		return currentStep - 1; // Adjust for welcome step
	};

	const CurrentStepComponent = allSteps[currentStep].component;
	const progressStepIndex = getProgressStepIndex();
	const showProgress = progressStepIndex >= 0;

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Logo */}
			<div className="flex justify-center pt-6 pb-4">
				<div className="flex items-center space-x-2">
					<Building2 className="h-6 w-6 md:h-8 md:w-8 text-primary" />
					<span className="font-bold text-xl md:text-2xl">HomeKeepr</span>
				</div>
			</div>

			{/* Step indicator - only show for progress steps */}
			{showProgress && (
				<div className="w-full px-4 max-w-4xl mx-auto mb-6">
					<div className="flex items-center justify-center">
						<div className="flex items-center space-x-1 md:space-x-3 overflow-x-auto pb-2">
							{progressSteps.map((step, index) => (
								<div
									key={step.name}
									className="flex items-center flex-shrink-0"
								>
									<div className="flex flex-col items-center space-y-1">
										<div
											className={`
                        w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all
                        ${
													index < progressStepIndex
														? "bg-primary text-primary-foreground"
														: index === progressStepIndex
															? "bg-primary text-primary-foreground ring-2 md:ring-4 ring-primary/20"
															: "bg-muted text-muted-foreground"
												}
                      `}
										>
											{index < progressStepIndex ? (
												<Check className="h-3 w-3 md:h-4 md:w-4" />
											) : (
												index + 1
											)}
										</div>
										<span
											className={`
                        text-xs whitespace-nowrap transition-colors
                        ${
													index <= progressStepIndex
														? "text-foreground font-medium"
														: "text-muted-foreground"
												}
                      `}
										>
											<span className="hidden md:inline">{step.name}</span>
											<span className="md:hidden">{step.mobile}</span>
										</span>
									</div>
									{index < progressSteps.length - 1 && (
										<div
											className={`
                        w-4 md:w-8 h-0.5 mx-1 md:mx-3 transition-colors
                        ${index < progressStepIndex ? "bg-primary" : "bg-muted"}
                      `}
										/>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Content */}
			<div className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-10 max-w-3xl mx-auto">
				<CurrentStepComponent />
			</div>

			{/* Navigation buttons */}
			{currentStep !== 0 && currentStep !== allSteps.length - 1 && (
				<Navigation />
			)}
		</div>
	);
};
