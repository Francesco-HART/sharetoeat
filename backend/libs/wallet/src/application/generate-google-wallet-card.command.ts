import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { GoogleWalletGateway } from "../ports/google-wallet.gateway";

export class GenerateGoogleWalletCardCommand implements ICommand {
  constructor(public shopId: string) {}
}

@CommandHandler(GenerateGoogleWalletCardCommand)
export class GenerateGoogleWalletCardCommandHandler
  implements ICommandHandler<GenerateGoogleWalletCardCommand, string>
{
  constructor(private readonly googleWalletGateway: GoogleWalletGateway) {}
  async execute(_: GenerateGoogleWalletCardCommand): Promise<string> {
    const classId =
      "3388000000022747072.loyalty_3ec8a9f7-0881-4f67-a8fc-8bc29886fef2";
    const card = await this.googleWalletGateway.createLoyaltyCard({
      classId,
    });
    return card.saveUrl;
  }
}
