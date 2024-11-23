import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logging/logging.service';
import * as Minio from 'minio';
import { Readable } from 'stream';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly client: Minio.Client;
  private readonly bucketName: string;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME', 'images');
    this.client = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT', 'minio'),
      port: parseInt(this.configService.get('MINIO_PORT', '9000')),
      useSSL: this.configService.get('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get('MINIO_SECRET_KEY', 'minioadmin'),
    });
  }

  async onModuleInit() {
    try {
      this.logger.debug(
        'Initializing MinIO service',
        'MinioService.onModuleInit',
        { bucketName: this.bucketName },
      );

      const bucketExists = await this.client.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.client.makeBucket(this.bucketName);
        this.logger.log(
          `Created bucket: ${this.bucketName}`,
          'MinioService.onModuleInit',
        );
      }

      // Set bucket policy to allow public read access
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };

      await this.client.setBucketPolicy(
        this.bucketName,
        JSON.stringify(policy),
      );
      this.logger.log(
        'MinIO service initialized successfully',
        'MinioService.onModuleInit',
      );
    } catch (error) {
      this.logger.error(
        'Failed to initialize MinIO service',
        error.stack,
        'MinioService.onModuleInit',
        { error: error.message },
      );
      throw error;
    }
  }

  async upload(key: string, buffer: Buffer): Promise<void> {
    try {
      await this.client.putObject(this.bucketName, key, buffer, buffer.length, {
        'Content-Type': key.endsWith('.webp') ? 'image/webp' : 'image/png',
      });
      this.logger.debug(`Uploaded file: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to upload file ${key}:`, error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async getFileStream(key: string): Promise<Readable> {
    try {
      return await this.client.getObject(this.bucketName, key);
    } catch (error) {
      this.logger.error(`Failed to get file stream for ${key}:`, error);
      throw new Error(`Failed to get file: ${error.message}`);
    }
  }

  async getPresignedUrl(key: string): Promise<string> {
    try {
      return await this.client.presignedGetObject(
        this.bucketName,
        key,
        24 * 60 * 60, // 24 hours expiry
      );
    } catch (error) {
      this.logger.error(`Failed to generate presigned URL for ${key}:`, error);
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucketName, key);
      this.logger.debug(`Deleted file: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file ${key}:`, error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async deleteFiles(keys: string[]): Promise<void> {
    try {
      await this.client.removeObjects(this.bucketName, keys);
      this.logger.debug(`Deleted files: ${keys.join(', ')}`);
    } catch (error) {
      this.logger.error(`Failed to delete files:`, error);
      throw new Error(`Failed to delete files: ${error.message}`);
    }
  }

  async checkConnection(): Promise<void> {
    try {
      await this.client.bucketExists(this.bucketName);
    } catch (error) {
      this.logger.error('MinIO health check failed:', error);
      throw new Error('Failed to connect to MinIO');
    }
  }
}
