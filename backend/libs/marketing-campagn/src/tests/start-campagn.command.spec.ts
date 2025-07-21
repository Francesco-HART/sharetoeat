import { DeterministicIDGenerator } from "@app/core/domain/providers/id-generator/deterministic-id-generator";
import { IDGenerator } from "@app/core/domain/providers/id-generator/id-generator";
import { FakeSequentialIDGenerator } from "@app/core/domain/providers/id-generator/sequential-id-generator";
import { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { StartMarketingCampagnCommandHandler } from "../application/commands/start-marketing-campagn";
import { InMemoryCampagnRepository } from "../infra/in-memory-campagn.repository";
import { CampagnFixture, createCampagnFixture } from "./fixture";

describe("Start compagn", () => {
  let fixture: CampagnFixture;

  describe("Rule: create one campagn for a shop  ", () => {
    it("One compagn is createed for one shop", async () => {
      fixture = createCampagnFixture();
      fixture.givenIds(["3"]);
      fixture.whenStartMarketingCampagn(
        new StartMarketingCampagnCommand({
          id: "1",
          shopId: "2",
          notifications: [
            {
              scheduledAt: new Date("2025-12-07"),
              message: "Hello",
            },
          ],
        })
      );

      fixture.thenCampagnShouldBe("1", {
        id: "1",
        shopId: "2",
        notifications: [
          {
            id: "3",
            scheduledAt: new Date("2025-12-07"),
            message: "Hello",
            isSent: false,
          },
        ],
      });
    });

    it("One campagn is created with multiples notifications for one shop", async () => {
      fixture = createCampagnFixture();
      fixture.givenIds(["3", "4"]);
      fixture.whenStartMarketingCampagn(
        new StartMarketingCampagnCommand({
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
        })
      );

      fixture.thenCampagnShouldBe("1", {
        id: "1",
        shopId: "2",
        notifications: [
          {
            id: "3",
            scheduledAt: new Date("2025-12-07"),
            message: "Hello",
            isSent: false,
          },

          {
            id: "4",
            scheduledAt: new Date("2025-12-07"),
            message: "Hello two",
            isSent: false,
          },
        ],
      });
    });
  });
});

export class StartMarketingCampagnCommand implements ICommand {
  constructor(
    public params: {
      id: string;
      shopId: string;
      notifications: {
        scheduledAt: Date;
        message: string;
      }[];
    }
  ) {}
}
