import { Button } from "@repo/ui/components/button";
import type { FC } from "react";
import { Link, useParams } from "react-router";

export const GenerationPage: FC = () => {
	const { id } = useParams<{
		id: string;
	}>();

	return (
		<div className="flex-1 space-y-6 p-6">
			<Link to={`http://192.168.1.139:3000/apple-wallet/${id}`}>
				<Button>Generate iOS Card</Button>
			</Link>
			<Link to={`http://192.168.1.139:3000/google-wallet/${id}`}>
				<Button>Generate Android Card</Button>
			</Link>
		</div>
	);
};
