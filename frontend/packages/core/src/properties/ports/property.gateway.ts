import { type LegalObligation } from "../property.entity";

export interface PropertyGateway {
  createProperty: (property: AddProperty) => Promise<string>;
  determineLegalObligations: (propertyId: string) => Promise<LegalObligation[]>;
}

export interface Property {
  id: string;
  name: string;
  type: "house" | "apartment";
  address: string;
  city: string;
  postalCode: string;
  surface: number;
  constructionYear: number;
  selected: string[];
  configs: Record<string, any>;
  isFurnished: boolean;
  tenantName?: string;
  leaseStartDate: string;
  hasDPE: boolean;
  dpeDate?: string;
  legalObligations: LegalObligation[];
}

export type AddProperty = {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  postalCode: string;
  surface: number;
  constructionYear: number;
  selected: string[];
  configs: Record<string, any>;
  isFurnished: boolean;
  tenantName?: string;
  leaseStartDate: string;
  email: string;
  hasDPE: boolean;
  dpeDate?: string;
};
