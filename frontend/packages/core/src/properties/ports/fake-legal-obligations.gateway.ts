import { type LegalObligation } from "../property.entity";
import type { AddProperty, PropertyGateway } from "./property.gateway";

export class FakePropertyGateway implements PropertyGateway {
  public obligations = new Map<string, LegalObligation[]>();
  propertyId = "";
  async createProperty(_: AddProperty): Promise<string> {
    return this.propertyId;
  }

  async determineLegalObligations(
    propertyId: string
  ): Promise<LegalObligation[]> {
    return this.obligations.get(propertyId) || [];
  }
}
