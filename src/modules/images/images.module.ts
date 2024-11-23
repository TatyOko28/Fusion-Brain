import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MinioModule } from '../minio/minio.module';
import { LoggingModule } from '../logging/logging.module';
import { FusionBrainModule } from '../fusion-brain/fusion-brain.module';

@Module({
  imports: [PrismaModule, MinioModule, LoggingModule, FusionBrainModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
