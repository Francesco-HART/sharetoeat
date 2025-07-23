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

        it("Multiple notifications is sent", async () => {
            fixture = createCampaignFixture();
            fixture.givenNow(new Date("2025-12-07"));
            fixture.givenCampaing(createCampaign({
                id: "123",
                shopId: "1",
                notifications: createNotifications([
                    createNotification({
                        scheduledAt: new Date("2025-12-07"),
                        message: "Hello, world!",
                    })
                ])
            }));
            fixture.givenCampaing(createCampaign({
                id: "456",
                shopId: "2",
                notifications: createNotifications([
                    createNotification({
                        scheduledAt: new Date("2025-12-07"),
                        message: "Hello, world! 2",
                    })
                ])
            }))

            await fixture.whenSendCampaignsNotifications();

            fixture.thenWalletNotificationsSentIs([
                {
                    shopId: "1",
                    message: "Hello, world!"
                },
                {
                    shopId: "2",
                    message: "Hello, world! 2"
                }
            ])
        });

        it("notification is not first notification of campaign", async () => {
            fixture = createCampaignFixture();
            fixture.givenNow(new Date("2025-12-07"));
            fixture.givenCampaing(createCampaign({
                shopId: "1",
                notifications: createNotifications([
                    createNotification({
                        scheduledAt: new Date("2025-12-06"),
                        message: "Hello, world!",
                    }),
                    createNotification({
                        scheduledAt: new Date("2025-12-07"),
                        message: "Hello, world! 2",
                    })

                ])
            }));

            await fixture.whenSendCampaignsNotifications();

            fixture.thenWalletNotificationsSentIs([
                {
                    shopId: "1",
                    message: "Hello, world! 2"
                },
            ])
        });

        it("notification is sent", async () => {
            fixture = createCampaignFixture();
            fixture.givenNow(new Date("2025-12-07T12:00:00Z"));
            fixture.givenCampaing(createCampaign({
                shopId: "1",
                notifications: createNotifications([
                    createNotification({
                        scheduledAt: new Date("2025-12-07T00:00:00Z"),
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

        it("Notification status change when sent", async () => {
            fixture = createCampaignFixture();
            fixture.givenNow(new Date("2025-12-07"));
            const campaign = createCampaign({
                id: "123",
                shopId: "1",
                notifications: createNotifications([
                    createNotification({
                        scheduledAt: new Date("2025-12-07"),
                        isSent: false
                    })
                ])
            });
            fixture.givenCampaing(campaign);

            await fixture.whenSendCampaignsNotifications();

            fixture.thenCampaignShouldBe("123", createCampaign({
                id: "123",
                shopId: "1",
                notifications: createNotifications([
                    createNotification({
                        scheduledAt: new Date("2025-12-07"),
                        isSent: true
                    })
                ])
            }))
        })
    });
});

