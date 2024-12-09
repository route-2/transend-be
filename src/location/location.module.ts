import { Module } from '@nestjs/common';
import { locationController } from './location.controller';
import { locationService } from './location.service';

@Module({
  controllers: [locationController],
  providers: [locationService],
})
export class locationModule {}