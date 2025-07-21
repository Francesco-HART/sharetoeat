import { CampaignFixture, createCampaignFixture } from "./fixture";
import { createCampaign } from "./campaign.builder";
import {
    createNotification,
    createNotifications,
} from "./notification.builder";

describe("Send campaigns notifications", () => {
    let fixture: CampaignFixture;

    describe("Rule: send one campaing notification", () => {
        it("One notification is sent", async () => {
            fixture = createCampaignFixture();
            fixture.givenNow(new Date("2025-12-07"));
            fixture.givenCampaing(createCampaign({
                shopId: "1",
                notifications: createNotifications([
                    createNotification({
                        scheduledAt: new Date("2025-12-07"),
                        message: "Hello, world!",
                    })
                ])
            }));

            await fixture.whenSendCampaignsNotifications();

            fixture.thenWalletNotificationsSentIs([
                {
                    shopId: "1",
                    message: "Hello, world!"
                }
            ])
        })
    });
});

