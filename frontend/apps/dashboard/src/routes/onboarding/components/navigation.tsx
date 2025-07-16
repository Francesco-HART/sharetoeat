import {
  previousStep,
  selectIsLastStep,
} from "@repo/core/onboarding/onboarding.slice";
import { Button } from "@repo/ui/components/button";
import type { FC } from "react";
import { useAppDispatch, useAppSelector } from "~/hooks/store";

export const Navigation: FC = () => {
  const isLastStep = useAppSelector((state) => selectIsLastStep(state));
  const dispatch = useAppDispatch();

  const handlePreviousStep = () => {
    dispatch(previousStep());
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 max-w-3xl mx-auto py-6 flex justify-between">
      <Button variant="outline" onClick={handlePreviousStep}>
        Précédent
      </Button>
      <Button form="step" type="submit">
        {isLastStep ? "Terminer" : "Suivant"}
      </Button>
    </div>
  );
};
