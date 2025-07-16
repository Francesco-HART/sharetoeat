import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Card, CardContent } from "@repo/ui/components/card";
import { Switch } from "@repo/ui/components/switch";
import { Checkbox } from "@repo/ui/components/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@repo/ui/components/popover";
import { useAppDispatch, useAppSelector } from "~/hooks/store";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nextStep, updateTenant } from "@repo/core/onboarding/onboarding.slice";
import { z } from "zod";
import { FormField } from "@repo/ui/components/form";

const formSchema = z.object({
	isFurnished: z.boolean(),
	leaseStartDate: z.string(),
	name: z.string().optional(),
	hasDPE: z.boolean(),
	dpeDate: z.string().optional(),
});

export function TenantStep() {
	const { tenant, documents } = useAppSelector(
		(state) => state.onboarding.formData,
	);
	const dispatch = useAppDispatch();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { ...tenant, ...documents },
		mode: "onChange",
	});

	const handleSubmit = form.handleSubmit((data) => {
		dispatch(updateTenant(data));
		dispatch(nextStep());
	});
	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-2xl font-bold tracking-tight">
					Informations sur la location
				</h1>
				<p className="text-muted-foreground">
					Ces informations nous aideront à déterminer les obligations
					spécifiques à votre location
				</p>
			</div>
			<form id="step" onSubmit={handleSubmit}>
				<Form {...form}>
					{/* <form id="step-end" onSubmit={handleSubmit}> */}
					<Card>
						<CardContent className="p-6 space-y-6">
							<div className="flex items-center justify-between py-3">
								<div className="space-y-0.5">
									<Label
										htmlFor="isFurnished"
										className="text-base font-medium"
									>
										Location meublée
									</Label>
									<p className="text-xs text-muted-foreground">
										Le logement est-il loué meublé ?
									</p>
								</div>
								<FormField
									control={form.control}
									name="isFurnished"
									render={({ field }) => (
										<Switch
											id="isFurnished"
											checked={field.value}
											onCheckedChange={(checked) =>
												field.onChange(checked === true)
											}
										/>
									)}
								/>
							</div>

							<div className="space-y-4 pt-3 border-t">
								<div className="space-y-2">
									<Label htmlFor="leaseStartDate">Date de début du bail</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className={cn(
													"w-full justify-start text-left font-normal",
													!form.watch("leaseStartDate") &&
														"text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{form.watch("leaseStartDate") ? (
													format(form.watch("leaseStartDate") || "", "PPP", {
														locale: fr,
													})
												) : (
													<span>Sélectionnez une date</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<FormField
												control={form.control}
												name="leaseStartDate"
												render={({ field }) => (
													<Calendar
														mode="single"
														selected={
															field?.value ? new Date(field.value) : undefined
														}
														onSelect={(selectedDate) => {
															field.onChange(
																selectedDate ? selectedDate.toISOString() : "",
															);
														}}
														initialFocus
														locale={fr}
													/>
												)}
											/>
										</PopoverContent>
									</Popover>
								</div>

								<div className="space-y-2">
									<Label>Nom du locataire (optionnel)</Label>

									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<Input
												placeholder="ex: Jean Dupont"
												value={field.value}
												onChange={(e) => {
													field.onChange(e.target.value);
												}}
											/>
										)}
									/>
								</div>
							</div>

							<div className="space-y-4 pt-3 border-t">
								<div className="space-y-2">
									<Label className="text-base font-medium">
										Documents existants
									</Label>
									<p className="text-xs text-muted-foreground">
										Sélectionnez les diagnostics que vous possédez déjà
									</p>
								</div>

								<div className="flex items-center space-x-2">
									<FormField
										control={form.control}
										name="hasDPE"
										render={({ field }) => (
											<Checkbox
												id="hasDPE"
												name="hasDPE"
												checked={field.value}
												onCheckedChange={(checked) => {
													field.onChange(checked === true);
													if (!checked) form.setValue("dpeDate", "");
												}}
											/>
										)}
									/>
									<Label htmlFor="hasDPE" className="text-sm">
										Diagnostic de Performance Énergétique (DPE)
									</Label>
								</div>

								{form.watch("hasDPE") && (
									<div className="space-y-2 pl-6">
										<Label htmlFor="dpeDate">Date du DPE</Label>
										<FormField
											control={form.control}
											name="dpeDate"
											render={({ field }) => (
												<Input
													id="dpeDate"
													name="dpeDate"
													placeholder="ex: 05/2022"
													type="month"
													value={field.value || ""}
													onChange={(e) => {
														field.onChange(e.target.value);
													}}
												/>
											)}
										/>
										<p className="text-xs text-muted-foreground">
											Le DPE est valable 10 ans
										</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</Form>
			</form>
		</div>
	);
}
