import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MinioModule } from '../minio/minio.module';
import { PrismaHealthIndicator } from './indicators/prisma.health';
import { MinioHealthIndicator } from './indicators/minio.health';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    PrismaModule,
    MinioModule,
  ],
  controllers: [HealthController],
  providers: [
    PrismaHealthIndicator,
    MinioHealthIndicator,
  ],
})
export class HealthModule {}
