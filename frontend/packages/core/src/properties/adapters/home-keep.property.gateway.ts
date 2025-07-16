import { LegalObligation } from "../property.entity";
import { AddProperty } from "../ports/property.gateway";
import { PropertyService } from "@repo/client-api/src/generated";
export class HomeKeeprPropertyGateway {
  async createProperty(command: AddProperty): Promise<string> {
    const data = await PropertyService.postProperty({
      name: command.name,
      type: command.type,
      address: command.address,
      city: command.city,
      postalCode: command.postalCode,
      surface: command.surface,
      constructionYear: command.constructionYear,
      selected: command.selected,
      configs: command.configs,
      isFurnished: command.isFurnished,
      leaseStartDate: command.leaseStartDate,
      email: command.email,
      hasDPE: command.hasDPE,
    });

    if (!data || !data.id) {
      throw new Error("Failed to create property");
    }
    return data.id;
  }

  async determineLegalObligations(
    propertyId: string
  ): Promise<LegalObligation[]> {
    const legalObligations = await PropertyService.getProperty1(propertyId);
    if (!legalObligations || legalObligations.length === 0) {
      return [];
    }
    return legalObligations.map((obligation) => ({
      title: obligation.code || "",
      dueDate: obligation.dueDate ? new Date(obligation.dueDate) : undefined,
      frequency: obligation.frequency || "",
    }));
  }
}
