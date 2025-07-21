import { FakeSequentialIDGenerator } from "@app/core/domain/providers/id-generator/sequential-id-generator";
import { InMemoryCampagnRepository } from "../infra/in-memory-campagn.repository";
import { StartMarketingCampagnCommandHandler } from "../application/commands/start-marketing-campagn";
import { StartMarketingCampagnCommand } from "./start-campagn.command.spec";
import { Campagn } from "../domain/campagn";

export type Dependecies = {
  campagnRepo: InMemoryCampagnRepository;
  idProvider: FakeSequentialIDGenerator;
};
export function createCampagnFixture(
  deps: Dependecies = {
    campagnRepo: new InMemoryCampagnRepository(),
    idProvider: new FakeSequentialIDGenerator(),
  }
) {
  let throwError;
  const startMarketingCampagnCommandHandler =
    new StartMarketingCampagnCommandHandler(deps.campagnRepo, deps.idProvider);

  return {
    givenIds(ids: string[]) {
      deps.idProvider.ids = ids;
    },

    async whenStartMarketingCampagn(command: StartMarketingCampagnCommand) {
      try {
        await startMarketingCampagnCommandHandler.execute(command);
      } catch (error) {
        throwError = error;
      }
    },

    thenCampagnShouldBe(campagnId: string, expectCampagn: Campagn) {
      expect(expectCampagn).toEqual(deps.campagnRepo.getOneCampagn(campagnId));
    },
  };
}

export type CampagnFixture = ReturnType<typeof createCampagnFixture>;
