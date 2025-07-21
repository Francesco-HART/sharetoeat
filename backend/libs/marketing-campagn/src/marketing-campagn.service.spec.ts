import { Test, TestingModule } from '@nestjs/testing';
import { MarketingCampagnService } from './marketing-campagn.service';

describe('MarketingCampagnService', () => {
  let service: MarketingCampagnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketingCampagnService],
    }).compile();

    service = module.get<MarketingCampagnService>(MarketingCampagnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
