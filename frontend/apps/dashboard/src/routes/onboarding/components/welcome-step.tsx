import { nextStep } from "@repo/core/onboarding/onboarding.slice";
import { Button } from "@repo/ui/components/button";
import type { FC } from "react";
import { useAppDispatch } from "~/hooks/store";

export const WelcomeStep: FC = () => {
	const dispatch = useAppDispatch();
	return (
		<div className="space-y-8">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Bienvenue sur HomeKeepr
				</h1>
				<p className="text-muted-foreground max-w-md mx-auto">
					Configurons votre premier logement pour vous aider à gérer toutes vos
					obligations légales
				</p>
			</div>

			<div className="flex justify-center pt-6">
				<Button size="lg" onClick={() => dispatch(nextStep())}>
					Commencer la configuration
				</Button>
			</div>

			<p className="text-center text-sm text-muted-foreground">
				Cette configuration prend environ 3 minutes
			</p>
		</div>
	);
};
