import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { NavLink } from "react-router";

export function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer className="bg-muted/30 border-t">
			<div className="container py-12">
				<div className="grid md:grid-cols-4 gap-8">
					<div>
						<div className="flex items-center space-x-2 mb-4">
							<Building2 className="h-6 w-6 text-primary" />
							<span className="font-bold text-xl">HomeKeepr</span>
						</div>
						<p className="text-sm text-muted-foreground mb-4">
							Le seul outil 100% dédié aux obligations légales du bailleur
							français.
						</p>
						<div className="flex items-center space-x-2 text-sm text-muted-foreground">
							<MapPin className="h-4 w-4" />
							<span>Made in France 🇫🇷</span>
						</div>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Produit</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<NavLink
									to="#"
									className="text-muted-foreground hover:text-primary"
								>
									Fonctionnalités
								</NavLink>
							</li>
							<li>
								<NavLink
									to="#"
									className="text-muted-foreground hover:text-primary"
								>
									Tarifs
								</NavLink>
							</li>
							<li>
								<NavLink
									to="#"
									className="text-muted-foreground hover:text-primary"
								>
									Démo
								</NavLink>
							</li>
							<li>
								<NavLink
									to="#"
									className="text-muted-foreground hover:text-primary"
								>
									API
								</NavLink>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Support</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<NavLink
									to="#"
									className="text-muted-foreground hover:text-primary"
								>
									Centre d'aide
								</NavLink>
							</li>
							<li>
								<NavLink
									to="#"
									className="text-muted-foreground hover:text-primary"
								>
									Guides
								</NavLink>
							</li>
							<li>
								<NavLink
									to="#"
									className="text-muted-foreground hover:text-primary"
								>
									Contact
								</NavLink>
							</li>
							<li>
								<NavLink
									to="#"
									className="text-muted-foreground hover:text-primary"
								>
									Statut
								</NavLink>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-4">Contact</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="flex items-center space-x-2">
								<Mail className="h-4 w-4" />
								<span>contact@homekeepr.fr</span>
							</li>
							<li className="flex items-center space-x-2">
								<Phone className="h-4 w-4" />
								<span>01 23 45 67 89</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
					<p>&copy; {year} HomeKeepr. Tous droits réservés.</p>
					<div className="flex space-x-6 mt-4 md:mt-0">
						<NavLink to="#" className="hover:text-primary">
							Mentions légales
						</NavLink>
						<NavLink to="#" className="hover:text-primary">
							Confidentialité
						</NavLink>
						<NavLink to="#" className="hover:text-primary">
							CGU
						</NavLink>
					</div>
				</div>
			</div>
		</footer>
	);
}
