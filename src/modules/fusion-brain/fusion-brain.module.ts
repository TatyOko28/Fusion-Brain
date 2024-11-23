import { Module } from '@nestjs/common';
import { FusionBrainService } from './fusion-brain.service';
import { ConfigModule } from '@nestjs/config';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [ConfigModule, LoggingModule],
  providers: [FusionBrainService],
  exports: [FusionBrainService],
})
export class FusionBrainModule {}
