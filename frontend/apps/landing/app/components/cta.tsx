import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Check, Crown } from "lucide-react";
import { NavLink } from "react-router";

export function CTA() {
	return (
		<section className="py-20 bg-gradient-to-br from-primary/5 to-amber-50">
			<div className="container">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-12">
						<Badge variant="secondary" className="mb-4">
							🎯 Parfait pour les petits propriétaires
						</Badge>
						<h2 className="text-3xl font-bold mb-4">
							Idéal pour les propriétaires de 1 à 10 logements
						</h2>
						<p className="text-xl text-muted-foreground">
							Commencez gratuitement et évoluez selon vos besoins
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8 mb-12">
						<Card className="border-primary/20">
							<CardContent className="p-6">
								<div className="flex items-center space-x-2 mb-4">
									<Badge variant="secondary">Gratuit</Badge>
								</div>
								<h3 className="font-semibold mb-4">Version gratuite</h3>
								<ul className="space-y-3 mb-6">
									<li className="flex items-center space-x-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">Jusqu'à 2 logements</span>
									</li>
									<li className="flex items-center space-x-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">Calendrier des obligations</span>
									</li>
									<li className="flex items-center space-x-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">Notifications par email</span>
									</li>
									<li className="flex items-center space-x-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">Stockage de base</span>
									</li>
								</ul>

								<Button variant="outline" className="w-full" asChild>
									<NavLink to="#">Commencer gratuitement</NavLink>
								</Button>
							</CardContent>
						</Card>

						<Card className="border-primary/20 relative">
							<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
								<Badge className="bg-primary text-primary-foreground">
									<Crown className="h-3 w-3 mr-1" />
									Recommandé
								</Badge>
							</div>
							<CardContent className="p-6">
								<div className="flex items-center space-x-2 mb-4">
									<Badge variant="default">Premium</Badge>
								</div>
								<h3 className="font-semibold mb-4">Version complète</h3>
								<ul className="space-y-3 mb-6">
									<li className="flex items-center space-x-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">Logements illimités</span>
									</li>
									<li className="flex items-center space-x-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">Réseau d'artisans</span>
									</li>
									<li className="flex items-center space-x-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">OCR automatique</span>
									</li>
									<li className="flex items-center space-x-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">Support prioritaire</span>
									</li>
								</ul>
								<Button className="w-full" asChild>
									<NavLink to="#">Découvrir Premium</NavLink>
								</Button>
							</CardContent>
						</Card>
					</div>

					<div className="text-center">
						<div className="bg-background rounded-2xl p-8 border border-primary/20 inline-block">
							<h3 className="text-2xl font-bold mb-4">
								Prêt à simplifier votre gestion ?
							</h3>
							<p className="text-muted-foreground mb-6">
								Commencez gratuitement dès maintenant, aucune carte bancaire
								requise
							</p>
							<div className="flex justify-center">
								<Button size="lg" className="text-lg px-8">
									Créer mon compte gratuit
								</Button>
							</div>
							<p className="text-xs text-muted-foreground mt-4">
								Gratuit pour toujours • Mise à niveau possible à tout moment
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
