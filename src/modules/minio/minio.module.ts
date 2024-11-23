import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ConfigModule } from '@nestjs/config';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    ConfigModule,
    LoggingModule,
  ],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
