import { GoogleWalletService } from "./google-wallet.service";

describe("GoogleWalletService", () => {
  let service: GoogleWalletService;

  beforeEach(() => {
    service = new GoogleWalletService({
      issuerId: "3388000000022747072",
      serviceAccountKey: "BCR2DN4T6OC75NLU",
      keyFilePath: "path/to/your/service-account.json", // Adjust the path as needed
    });
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
    const response = await service.sendWalletPushNotification(
      "3388000000022747072.5811342a-dbd1-4a8f-b814-88695323e3e0_customer_string_3388000000022747072.loyalty_3ec8a9f7-0881-4f67-a8fc-8bc29886fef2"
    );

    console.log(response);
    expect(response).toBeDefined();
  });
});
