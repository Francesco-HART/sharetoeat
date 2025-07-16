import { Input } from "@repo/ui/components/input";
import { Card, CardContent } from "@repo/ui/components/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@repo/ui/components/form";
import { useAppDispatch, useAppSelector } from "~/hooks/store";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    nextStep,
    updateProperty,
} from "@repo/core/onboarding/onboarding.slice";

const formSchema = yup.object({
    name: yup.string().required(),
    type: yup.string().required(),
    address: yup.string().required(),
    city: yup.string().required(),
    postalCode: yup.string().required(),
    surface: yup.number().positive().required(),
    constructionYear: yup.number().positive().required(),
});

const propertyTypes = ["Appartement", "Maison"];

export function PropertyInfoStep() {
    const { property } = useAppSelector((state) => state.onboarding.formData);
    const dispatch = useAppDispatch();

    const form = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: property as any,
        mode: "onChange",
    });

    const handleSubmit = form.handleSubmit((data) => {
        dispatch(updateProperty(data));
        dispatch(nextStep());
    });

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                    Informations sur le logement
                </h1>
                <p className="text-muted-foreground">
                    Ces informations nous permettront d'identifier les obligations légales
                    spécifiques à votre logement
                </p>
            </div>

            <Form {...form}>
                <form id="step" onSubmit={handleSubmit}>
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Nom du logement</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="ex: Appartement Paris 11ème"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Type de logement</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} {...field}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Sélectionnez un type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {propertyTypes.map((type) => (
                                                                <SelectItem key={type} value={type}>
                                                                    {type}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel>Adresse</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Numéro et nom de rue" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Ville</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ex: Paris" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="postalCode"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Code postal</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ex: 75011" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="surface"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Surface (m²)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="ex: 65"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="constructionYear"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Année de construction</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="ex: 1985"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>

            <p className="text-sm text-muted-foreground text-center">
                Ces informations nous aident à déterminer les diagnostics obligatoires
                pour votre logement
            </p>
        </div>
    );
}
