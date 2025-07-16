import { createTestStore } from "@repo/core/create-store";
import { OnboardingFormData } from "@repo/core/onboarding/onboarding.slice";
import { FakePropertyGateway } from "@repo/core/properties/ports/fake-legal-obligations.gateway";
import { Property } from "@repo/core/properties/ports/property.gateway";
import { PropertyEntity } from "@repo/core/properties/property.entity";
import { addProperty } from "@repo/core/properties/usecases/add-property.usecase";
import { determineLegalObligations } from "@repo/core/properties/usecases/determine-property-legal-obligations";
import { stateBuilder } from "@repo/core/state-builder";

describe("Feature: On  determine legal obligations of a property", () => {
  test("Example: John is authenticated", async () => {
    const propertyGateway = new FakePropertyGateway();
    const obligations = [
      {
        title: "Obligation 1",
        dueDate: new Date("2023-12-31"),
        frequency: "yearly",
      },
    ];
    const property: Property = {
      id: "1",
      name: "",
      type: "apartment",
      address: "",
      city: "",
      postalCode: "",
      surface: 0,
      constructionYear: 0,
      selected: [],
      configs: {},
      isFurnished: false,
      leaseStartDate: "",
      hasDPE: false,
      legalObligations: [],
    };

    const defaultProperty = {
      id: property.id,
      name: property.name,
      type: property.type,
      buildDate: new Date(property.constructionYear, 0, 1),
      adresse: {
        street: property.address,
        city: property.city,
        zipCode: property.postalCode,
      },
      legalObligations: [],
    };
    const preloadState = stateBuilder().withProperties(defaultProperty).build();
    propertyGateway.obligations.set("1", obligations);
    const store = createTestStore(
      {
        propertyGateway,
      },
      preloadState
    );

    const expectProperty = {
      id: property.id,
      name: property.name,
      type: property.type,
      buildDate: new Date(property.constructionYear, 0, 1),
      adresse: {
        street: property.address,
        city: property.city,
        zipCode: property.postalCode,
      },
      legalObligations: obligations,
    };

    await store.dispatch(determineLegalObligations(property.id));

    expect(store.getState()).toEqual(
      stateBuilder().withProperties(expectProperty).build()
    );
  });
});
