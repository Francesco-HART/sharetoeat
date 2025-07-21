import { FakeSequentialIDGenerator } from "@app/core/domain/providers/id-generator/sequential-id-generator";
import { StartMarketingCampaignCommandHandler } from "../application/commands/start-marketing-campaign";
import { Campaign } from "../domain/campaign";
import { InMemoryCampaignRepository } from "../infra/in-memory-campaign.repository";
import { StartMarketingCampaignCommand } from "./start-campaign.command.spec";

export type Dependecies = {
  CampaignRepo: InMemoryCampaignRepository;
  idProvider: FakeSequentialIDGenerator;
};
export function createCampaignFixture(
  deps: Dependecies = {
    CampaignRepo: new InMemoryCampaignRepository(),
    idProvider: new FakeSequentialIDGenerator(),
  }
) {
  let throwError;
  const startMarketingCampaignCommandHandler =
    new StartMarketingCampaignCommandHandler(
      deps.CampaignRepo,
      deps.idProvider
    );

  return {
    givenIds(ids: string[]) {
      deps.idProvider.ids = ids;
    },

    async whenStartMarketingCampaign(command: StartMarketingCampaignCommand) {
      try {
        await startMarketingCampaignCommandHandler.execute(command);
      } catch (error) {
        throwError = error;
      }
    },

    thenCampaignShouldBe(CampaignId: string, expectCampaign: Campaign) {
      expect(expectCampaign).toEqual(
        deps.CampaignRepo.getOneCampaign(CampaignId)
      );
    },
  };
}

export type CampaignFixture = ReturnType<typeof createCampaignFixture>;
