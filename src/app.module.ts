import { Module } from '@nestjs/common';
import { ImagesModule } from './modules/images/images.module';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { MinioModule } from './modules/minio/minio.module';
import { LoggingModule } from './modules/logging/logging.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    MinioModule,
    LoggingModule,
    ImagesModule,
    HealthModule,
  ],
})
export class AppModule {}
