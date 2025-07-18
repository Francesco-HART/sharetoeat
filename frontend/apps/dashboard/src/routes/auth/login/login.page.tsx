import { authWithGoogle } from "@repo/core/auth/usecases/auth-with-google";
import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { Building2 } from "lucide-react";
import type { FC } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAppDispatch } from "~/hooks/store";
import { FaGoogle, FaApple } from "react-icons/fa";
import { isFulfilled } from "@reduxjs/toolkit";

export const LoginPage: FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const loginWithGoogle = async () => {
		const result = await dispatch(authWithGoogle());
		if (isFulfilled(result)) {
			navigate("/", { viewTransition: true });
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="flex items-center justify-center space-x-2 mb-4">
						<Building2 className="h-6 w-6 text-primary" />
						<span className="font-bold text-xl">Wally</span>
					</div>
					<CardTitle className="text-2xl">Se connecter</CardTitle>
					<CardDescription>Accédez à votre tableau de bord</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-3">
						<Button
							variant="outline"
							className="w-full"
							onClick={loginWithGoogle}
						>
							<FaGoogle className="h-4 w-4" />
							<span>Continuer avec Google</span>
						</Button>

						<Button variant="outline" className="w-full">
							<FaApple className="h-4 w-4" />
							<span>Continuer avec Apple</span>
						</Button>
					</div>
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<Separator className="w-full" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Ou
							</span>
						</div>
					</div>

					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="votre@email.com"
								value={""}
								required
							/>
						</div>
						<Button type="submit" className="w-full">
							Envoyer le lien de connexion
						</Button>
					</form>

					<div className="text-center text-sm text-muted-foreground">
						<p>
							Pas encore de compte ?{" "}
							<NavLink to="/signup" className="text-primary hover:underline">
								Créer un compte
							</NavLink>
						</p>
					</div>

					<div className="text-center">
						<p className="text-xs text-muted-foreground">
							En vous connectant, vous acceptez nos{" "}
							<NavLink to="/terms" className="text-primary hover:underline">
								conditions d'utilisation
							</NavLink>{" "}
							et notre{" "}
							<NavLink to="/privacy" className="text-primary hover:underline">
								politique de confidentialité
							</NavLink>
							.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
