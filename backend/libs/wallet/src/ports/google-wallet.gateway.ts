export abstract class GoogleWalletGateway {
  abstract createLoyaltyCard(
    command: CreateLoyaltyCardDto
  ): Promise<{ objectId: string; saveUrl: string }>;
}

export interface CreateLoyaltyCardDto {
  classId: string;
}
