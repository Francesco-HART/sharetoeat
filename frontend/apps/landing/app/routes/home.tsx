import { CTA } from "~/components/cta";
import { Features } from "~/components/feature";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { Hero } from "~/components/hero";
import { ProblemSolution } from "~/components/problem-solution";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
	return [
		{ title: "HomeKeepr" },
		{
			name: "description",
			content: "Le seul outil 100% dédié aux obligations légales du bailleur",
		},
	];
}

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			<Header />
			<main>
				<Hero />
				<ProblemSolution />
				<Features />
				<CTA />
			</main>
			<Footer />
		</div>
	);
}
