import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import databaseConfig from './database.config';
import minioConfig from './minio.config';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, minioConfig, appConfig],
      validationSchema: Joi.object({
        // App
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        LOG_LEVEL: Joi.string()
          .valid('error', 'warn', 'info', 'debug', 'verbose')
          .default('info'),
        ALLOWED_ORIGINS: Joi.string().required(),

        // Database
        DATABASE_URL: Joi.string().required(),

        // MinIO
        MINIO_ENDPOINT: Joi.string().required(),
        MINIO_PORT: Joi.number().default(9000),
        MINIO_USE_SSL: Joi.boolean().default(false),
        MINIO_ACCESS_KEY: Joi.string().required(),
        MINIO_SECRET_KEY: Joi.string().required(),
        MINIO_BUCKET_NAME: Joi.string().required(),

        // External Services
        FUSION_BRAIN_API_URL: Joi.string().uri().required(),
        FUSION_BRAIN_API_KEY: Joi.string().required(),

        // Health Check
        HEALTH_CHECK_DISK_THRESHOLD: Joi.number().min(0).max(1).default(0.9),
        HEALTH_CHECK_MEMORY_HEAP_THRESHOLD: Joi.number()
          .positive()
          .default(150),
        HEALTH_CHECK_MEMORY_RSS_THRESHOLD: Joi.number().positive().default(150),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
})
export class AppConfigModule {}
