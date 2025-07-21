import { FakeSequentialIDGenerator } from "@app/core/domain/providers/id-generator/sequential-id-generator";
import { StartMarketingCampaignCommand, StartMarketingCampaignCommandHandler } from "../application/commands/start-marketing-campaign.command";
import { Campaign } from "../domain/campaign";
import { InMemoryCampaignRepository } from "../infra/in-memory-campaign.repository";
import { SendNotificationParams, WalletGateway } from "@app/wallet/public-ports/wallet.gateway";
import { DeterministicClock } from "@app/core/domain/providers/clock/deterministic-clock";
import { Clock } from "@app/core/domain/providers/clock/clock";
import { SendCampaignsNotificationsCommand, SendCampaignsNotificationsCommandHandler } from "../application/commands/send-campaigns-notifications.command";


export class FakeWalletGateway implements WalletGateway {
    private notificationsSent: SendNotificationParams[] = [];

    async sendNotification(params: SendNotificationParams): Promise<void> {
        this.notificationsSent.push(params);
    }

    public getNotificationsSent(): SendNotificationParams[] {
        return this.notificationsSent;
    }
}

export type Dependecies = {
    campaignRepo: InMemoryCampaignRepository;
    idProvider: FakeSequentialIDGenerator;
    walletGateway: ;
    clock: DeterministicClock;
};
export function createCampaignFixture(
    deps: Dependecies = {
        campaignRepo: new InMemoryCampaignRepository(),
        idProvider: new FakeSequentialIDGenerator(),
        walletGateway: new FakeWalletGateway(),
        clock: new DeterministicClock(new Date("")),
    }
) {
    let throwError;
    const startMarketingCampaignCommandHandler =
        new StartMarketingCampaignCommandHandler(
            deps.campaignRepo,
            deps.idProvider
        );

    const sendCampaignsNotificationsCommandHandler =
        new SendCampaignsNotificationsCommandHandler(
            deps.campaignRepo,
            deps.clock,
            deps.walletGateway
        );

    return {
        givenIds(ids: string[]) {
            deps.idProvider.ids = ids;
        },

        givenCampaing(campaign: Campaign) {
            deps.campaignRepo.addCampaign(campaign);
        },

        givenNow(now: Date) {
            deps.clock.currentDate = now;
        },

        async whenStartMarketingCampaign(params: StartMarketingCampaignCommand["params"]) {
            try {
                await startMarketingCampaignCommandHandler.execute(new StartMarketingCampaignCommand(params));
            } catch (error) {
                throwError = error;
            }
        },

        async whenSendCampaignsNotifications() {
            try {
                await sendCampaignsNotificationsCommandHandler.execute(new SendCampaignsNotificationsCommand());
            } catch (error) {
                throwError = error;
            }
        },

        thenCampaignShouldBe(CampaignId: string, expectCampaign: Campaign) {
            expect(expectCampaign).toEqual(
                deps.campaignRepo.getOneCampaign(CampaignId)
            );
        },

        thenWalletNotificationsSentIs(notificationsSent: SendNotificationParams[]) {
            expect(deps.eventBus.getNotificationsSent()).toEqual(notificationsSent);
        }
    };
}

export type CampaignFixture = ReturnType<typeof createCampaignFixture>;
