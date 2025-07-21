import { CampaignFixture, createCampaignFixture } from "./fixture";
import { createCampaign } from "./campaign.builder";
import {
    createNotification,
    createNotifications,
} from "./notification.builder";

describe("Start compagn", () => {
    let fixture: CampaignFixture;

    describe("Rule: create one Campaign for a shop  ", () => {
        it("One compagn is createed for one shop", async () => {
            fixture = createCampaignFixture();
            fixture.givenIds(["3"]);
            fixture.whenStartMarketingCampaign(
                {
                    id: "1",
                    shopId: "2",
                    notifications: [
                        {
                            scheduledAt: new Date("2025-12-07"),
                            message: "Hello",
                        },
                    ],
                }
            );

            fixture.thenCampaignShouldBe(
                "1",
                createCampaign({
                    id: "1",
                    shopId: "2",
                    notifications: [
                        createNotification({
                            id: "3",
                            scheduledAt: new Date("2025-12-07"),
                            message: "Hello",
                        }),
                    ],
                })
            );
        });

        it("One Campaign is created with multiples notifications for one shop", async () => {
            fixture = createCampaignFixture();
            fixture.givenIds(["3", "4"]);
            fixture.whenStartMarketingCampaign(
                {
                    id: "1",
                    shopId: "2",
                    notifications: [
                        {
                            scheduledAt: new Date("2025-12-07"),
                            message: "Hello",
                        },

                        {
                            scheduledAt: new Date("2025-12-07"),
                            message: "Hello two",
                        },
                    ],
                }
            );

            const expectCampagn = createCampaign({
                id: "1",
                shopId: "2",
                notifications: createNotifications([
                    {
                        id: "3",
                        scheduledAt: new Date("2025-12-07"),
                        message: "Hello",
                    },
                    {
                        id: "4",
                        scheduledAt: new Date("2025-12-07"),
                        message: "Hello two",
                    },
                ]),
            });
            fixture.thenCampaignShouldBe("1", expectCampagn);
        });
    });
});

