import { Module } from '@nestjs/common';
import { MarketingCampagnService } from './marketing-campagn.service';

@Module({
  providers: [MarketingCampagnService],
  exports: [MarketingCampagnService],
})
export class MarketingCampagnModule {}
