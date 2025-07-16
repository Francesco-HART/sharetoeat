import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { CheckCircle } from "lucide-react";
import { NavLink } from "react-router";
import { useAppDispatch, useAppSelector } from "~/hooks/store";
import {
  selectHasValidEmail,
  updateEmail,
} from "@repo/core/onboarding/onboarding.slice";
import { addProperty } from "@repo/core/properties/usecases/add-property.usecase";

export function CompletionStep() {
  const dispatch = useAppDispatch();
  const hasValidEmail = useAppSelector((state) => selectHasValidEmail(state));

  const handleAddEmail = (email: string) => {
    dispatch(updateEmail(email));
    dispatch(addProperty());
  };

  if (!hasValidEmail) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-3">
            {/* <AlertTriangle className="h-10 w-10 text-yellow-500" /> */}
            <h2 className="text-xl font-semibold text-center">
              Adresse email requise
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Pour finaliser, indiquez une adresse email afin de recevoir les
              obligations légales de votre logement.
            </p>
            <form
              className="w-full space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const email = (
                  e.currentTarget.elements.namedItem(
                    "email"
                  ) as HTMLInputElement
                )?.value;
                if (email) {
                  handleAddEmail(email);
                }
              }}
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Votre adresse email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
              <Button type="submit" className="w-full">
                Valider mon email
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configuration terminée !
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Votre logement a été configuré. Les obligations légales vous seront
          envoyées par email.
        </p>
      </div>

      <div className="flex justify-center pt-6">
        <Button size="lg" asChild>
          <NavLink to="/">Accéder à mon tableau de bord</NavLink>
        </Button>
      </div>

      {/* <p className="text-center text-sm text-muted-foreground">
        Vous pourrez ajouter d'autres logements depuis votre tableau de bord
      </p> */}
    </div>
  );
}
