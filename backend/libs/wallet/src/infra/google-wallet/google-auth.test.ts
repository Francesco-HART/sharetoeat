import path from "path";
import { GoogleAuthentifier } from "./google-wallet-authentifier";
import { GoogleWalletGenerator } from "./google-wallet-generator";
import { GoogleWalletSdk } from "./google-wallet-sdk";
import { GoogleWalletNotifier } from "./google-wallet-notifier";

describe("GoogleWalletService", () => {
  let service: GoogleWalletSdk;

  beforeEach(() => {
    const authentifier = new GoogleAuthentifier({
      serviceAccountKeyFilePath: path.resolve("service-account.json"),
    });
    const googleWalletGenerator = new GoogleWalletGenerator(
      {
        issuerId: "3388000000022747072",
      },
      authentifier
    );
    const googleWalletNotifier = new GoogleWalletNotifier(authentifier);

    service = new GoogleWalletSdk(googleWalletGenerator, googleWalletNotifier);
  });

  it("should create a service instance with the given issuerId", async () => {
    const response = await service.createLoyaltyCard({
      classId:
        "3388000000022747072.loyalty_3ec8a9f7-0881-4f67-a8fc-8bc29886fef2",
      // customerName: "string",
      // points: 10,
      // cardNumber: "string",
      // companyName: "string",
    });

    console.log(response);
    expect(response).toBeDefined();
    expect(response.objectId).toContain("loyalty_card");
  });

  it.only("should create a service instance with the given issuerId", async () => {
    // const response = await service.notify(
    //   "3388000000022747072.5811342a-dbd1-4a8f-b814-88695323e3e0_customer_string_3388000000022747072.loyalty_3ec8a9f7-0881-4f67-a8fc-8bc29886fef2",
    //   "message test"
    // );
    // console.log(response);
    // expect(response).toBeDefined();
  });
});
