import { Module } from '@nestjs/common';
import { LoggerService } from './logging.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggingModule {}
