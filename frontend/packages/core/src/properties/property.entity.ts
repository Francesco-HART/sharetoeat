import { createEntityAdapter } from "@reduxjs/toolkit";

export const propertyTypes = ["house", "apartment"] as const;
export type PropertyType = (typeof propertyTypes)[number];

export const heatingTypes = [
  "individual-gas",
  "collective-gas",
  "electric",
  "wood_stove",
  "fuel_oil",
  "heat_pump",
  "other",
] as const;

export type PorpertyLease = {
  startDate: Date;
  isFurnished: boolean;
};

export type HeatingType = (typeof heatingTypes)[number];

export type Adresse = {
  street: string;
  city: string;
  zipCode: string;
};

export type LegalObligation = {
  title: string;
  dueDate: Date | undefined;
  frequency: string;
};

export type PropertyEntity = {
  id: string;
  name: string;
  adresse: Adresse;
  type: PropertyType;
  buildDate: Date;
  legalObligations: LegalObligation[];
  lease?: PorpertyLease;
};

export const propertiesAdapter = createEntityAdapter<PropertyEntity>();
